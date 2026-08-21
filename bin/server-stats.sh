#!/bin/sh
# Visitor stats for hugodaniel.com, executed ON the OpenBSD server.
# Invoked by `make stats` as: ssh example.com 'sh -s' < bin/server-stats.sh
#
# httpd logs with `log style forwarded` (relayd sits in front), so after
# splitting a line on '"' the fields are:
#   $2 = request line    $3 = status + bytes    $4 = referrer
#   $6 = user agent      $7 = real client IP
#
# The log rotates weekly (Saturday), so the report below is week-to-date.
# To survive rotation, every run folds per-day/per-page counts into a rollup
# file outside /var/www/logs (see $ROLLUP). That is what makes the longitudinal
# numbers — residual readership, post half-life — possible at all.
#
# Rotated logs ($LOG.0, $LOG.0.gz, ...) are also folded in, so skipping a week
# does not lose history. The merge is idempotent: any day present in the logs
# replaces that day's rollup rows, so running this twice a day is safe and
# today's partial count self-corrects on the next run.
#
# The one thing to keep true: run this at least as often as newsyslog keeps
# rotated generations. A day is recorded as completely as the last run that
# could still see it in a log; once every log holding that day is gone, the
# rollup row for it is frozen.

LOG=${LOG:-/var/www/logs/access-hugodaniel.com}
ROLLUP=${ROLLUP:-$HOME/.hugodaniel-stats/rollup.tsv}
TODAY=$(date '+%Y-%m-%d')
BOTS='bot|crawl|spider|scan|curl|wget|python|go-http|java|feed|rss|reader|monitor|uptime|probe|headless|preview|fetch|archive|scrape'

TMPD=$(mktemp -d) || exit 1
trap 'rm -rf "$TMPD"' EXIT
CUR=$TMPD/cur
OLD=$TMPD/old
mkdir -p "$CUR" "$OLD" "$(dirname "$ROLLUP")" || exit 1
for d in "$CUR" "$OLD"; do
	: > "$d/pv"; : > "$d/nav"; : > "$d/med"; : > "$d/vid"
	: > "$d/feed"; : > "$d/ext"; : > "$d/status"; : > "$d/reqs"
done
[ -f "$ROLLUP" ] || : > "$ROLLUP"

# parse <outdir> — reads raw log lines on stdin, appends tab-separated records:
#   pv     day, ip, path          one human page view
#   nav    from, to               page view arrived at from another page here
#   med    page, ip, asset        body image/video loaded while reading `page`
#   vid    page, ip               video/animation actually fetched
#   ext    host, path             page view arrived from another site
#   feed   ip                     /atom.xml fetch (bots NOT filtered: readers look like bots)
parse() {
	awk -F'"' -v bots="$BOTS" -v D="$1" '
	function pathof(u) {
		sub(/^https?:\/\/[^\/]+/, "", u)
		sub(/[?#].*/, "", u)
		return u
	}
	BEGIN {
		split("Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec", mn, " ")
		for (i = 1; i <= 12; i++) mnum[mn[i]] = sprintf("%02d", i)
		PV = D "/pv"; NAV = D "/nav"; MED = D "/med"; VID = D "/vid"
		EXT = D "/ext"; FEED = D "/feed"; STAT = D "/status"; REQ = D "/reqs"
	}
	{
		split($2, r, " ")
		split($3, s, " ")
		if (s[1] != "") status[s[1]]++
		if (r[1] != "GET") next

		path = r[2]; sub(/[?#].*/, "", path)
		split($7, f, " "); ip = f[1]

		if (path ~ /^\/atom\.xml/) print ip >> FEED

		if (tolower($6) ~ bots) next
		# 304 counts for assets (a revalidated image was still wanted), but a
		# page view stays 200-only so these totals match what the script
		# reported before the rollup existed.
		if (s[1] != "200" && s[1] != "304") next

		split($1, d, "[")
		split(substr(d[2], 1, 11), p, "/")
		if (!(p[2] in mnum)) next
		iso = p[3] "-" mnum[p[2]] "-" p[1]

		internal = ($4 ~ /^https?:\/\/(www\.)?hugodaniel\.com\//)
		from = internal ? pathof($4) : ""

		ispage = (path !~ /\.(css|js|mjs|png|jpe?g|webp|gif|svg|avif|ico|woff2?|ttf|otf|xml|txt|json|gz|asc|pdf|mp4|webm|zip|wasm|map)$/)
		# Body media only: /assets/ is chrome (icons), and a request with no
		# internal referrer is a crawler or a hotlink, not someone reading.
		ismedia = (path ~ /\.(png|jpe?g|webp|gif|svg|avif|mp4|webm)$/ && path !~ /^\/assets\//)

		if (ispage && s[1] == "200") {
			print iso "\t" ip "\t" path >> PV
			if (internal && from != path) print from "\t" path >> NAV
			else if ($4 != "" && $4 != "-" && !internal) {
				split($4, u, "/"); if (u[3] != "") print u[3] "\t" path >> EXT
			}
		}
		if (ismedia && from != "") {
			print from "\t" ip "\t" path >> MED
			if (path ~ /\.(mp4|webm)$/) print from "\t" ip >> VID
		}
	}
	END {
		print NR >> REQ
		for (c in status) print c "\t" status[c] >> STAT
	}'
}

doas cat "$LOG" | parse "$CUR"
for f in "$LOG".[0-9] "$LOG".[0-9].gz "$LOG".[0-9][0-9].gz; do
	[ -f "$f" ] || continue
	case "$f" in
		*.gz) doas cat "$f" | gzip -dc ;;
		*)    doas cat "$f" ;;
	esac | parse "$OLD"
done

# ---------------------------------------------------------------- week to date

FIRST_DAY=$(cut -f1 "$CUR/pv" | sort | head -n 1)
VIEWS=$(wc -l < "$CUR/pv" | tr -d ' ')
UNIQ=$(cut -f2 "$CUR/pv" | sort -u | wc -l | tr -d ' ')
TVIEWS=$(grep -c "^$TODAY" "$CUR/pv")
TUNIQ=$(grep "^$TODAY" "$CUR/pv" | cut -f2 | sort -u | wc -l | tr -d ' ')
REQS=$(cat "$CUR/reqs")
FEEDN=$(sort -u "$CUR/feed" | wc -l | tr -d ' ')

echo ""
if [ -n "$FIRST_DAY" ]; then
	echo "hugodaniel.com — since $FIRST_DAY (log rotates Saturday)"
else
	echo "hugodaniel.com — no human page views in the current log"
fi
echo ""
echo "  page views       $VIEWS   (today: $TVIEWS)"
echo "  unique visitors  $UNIQ   (today: $TUNIQ)"
echo "  feed readers     $FEEDN unique IPs fetched /atom.xml"
echo "  total requests   $REQS (incl. bots and assets)"

echo ""
echo "Views per day"
cut -f1 "$CUR/pv" | sort | uniq -c | awk '{ printf "  %s  %6d\n", $2, $1 }'

echo ""
echo "Top pages"
cut -f3 "$CUR/pv" | sort | uniq -c | sort -rn | head -n 10 |
	awk '{ printf "  %6d  %s\n", $1, $2 }'

# ------------------------------------------------------------- reading depth

echo ""
echo "Reading depth — body media loaded per reader"
echo "  (a cached image sends no request, so read these as relative, not absolute)"
awk -v pv="$CUR/pv" -v med="$CUR/med" -v vid="$CUR/vid" '
	FILENAME == pv  { if (!seen[$3, $2]++) readers[$3]++; next }
	FILENAME == med { if (!got[$1, $2, $3]++) assets[$1]++
	                  if (!mseen[$1, $2]++) deep[$1]++; next }
	FILENAME == vid { if (!vseen[$1, $2]++) plays[$1]++; next }
	END {
		for (p in readers) {
			if (readers[p] < 5) continue          # too small to mean anything
			d = deep[p] + 0
			printf "%d\t%d\t%.1f\t%d\t%s\n", readers[p], d,
				d ? assets[p] / d : 0, plays[p] + 0, p
		}
	}' "$CUR/pv" "$CUR/med" "$CUR/vid" | sort -rn | head -n 12 |
	awk 'BEGIN { printf "  %8s %8s %7s %7s  %s\n", "readers", "w/media", "assets", "videos", "page" }
	     { printf "  %8d %8d %7.1f %7d  %s\n", $1, $2, $3, $4, $5 }'

echo ""
echo "How far visitors go"
cut -f2,3 "$CUR/pv" | sort -u | cut -f1 | sort | uniq -c |
	awk '{ if ($1 >= 5) b = "5+"; else b = $1; n[b]++; total++ }
	     END {
		split("1 2 3 4 5+", o, " ")
		for (i = 1; i <= 5; i++) {
			k = o[i]
			printf "  %-3s page%s  %6d visitors  %5.1f%%\n", k, (k == "1" ? " " : "s"),
				n[k] + 0, total ? (n[k] + 0) * 100 / total : 0
		}
	     }'

# -------------------------------------------------------- internal navigation

echo ""
echo "Internal navigation — readers moving between pages"
NAVN=$(wc -l < "$CUR/nav" | tr -d ' ')
echo "  $NAVN of $VIEWS page views came from another page here"
sort "$CUR/nav" | uniq -c | sort -rn | head -n 12 |
	awk '{ printf "  %6d  %s\n         -> %s\n", $1, $2, $3 }'

echo ""
echo "Leaving /start-here/"
awk -F'\t' '$1 ~ /^\/start-here\/?$/ { print $2 }' "$CUR/nav" |
	sort | uniq -c | sort -rn | head -n 10 |
	awk '{ printf "  %6d  %s\n", $1, $2 }'
awk -F'\t' '$1 ~ /^\/start-here\/?$/' "$CUR/nav" | wc -l |
	awk '{ printf "  %6d  total clicks out of the map\n", $1 }'

echo ""
echo "Top referrers"
cut -f1 "$CUR/ext" | sort | uniq -c | sort -rn | head -n 10 |
	awk '{ printf "  %6d  %s\n", $1, $2 }'

echo ""
echo "Status codes"
awk -F'\t' '{ n[$1] += $2 } END { for (c in n) printf "  %s  %6d\n", c, n[c] }' \
	"$CUR/status" | sort -rn -k2

# --------------------------------------------------------------------- rollup

# Fold every day we can still see into the rollup, replacing (not adding to)
# any day already recorded — so re-runs and overlapping rotated logs are safe.
cat "$CUR/pv" "$OLD/pv" | awk -F'\t' '
	{
		k = $1 "\t" $3
		views[k]++
		if (!seen[$1, $2, $3]++) uniq[k]++
	}
	END { for (k in views) print k "\t" views[k] "\t" uniq[k] }' > "$TMPD/fresh"

awk -F'\t' 'NR == FNR { day[$1] = 1; next } !($1 in day)' \
	"$TMPD/fresh" "$ROLLUP" > "$TMPD/kept"
cat "$TMPD/kept" "$TMPD/fresh" | sort -o "$ROLLUP"

RDAYS=$(cut -f1 "$ROLLUP" | sort -u | wc -l | tr -d ' ')
RFROM=$(head -n 1 "$ROLLUP" | cut -f1)

echo ""
echo "Rollup — $ROLLUP"
echo "  $RDAYS days recorded since $RFROM"

# What a post still pulls once the launch spike is over.
#
# A post only has a real "launch week" if the rollup was already watching when
# it went out. For anything older, the first rows in the rollup are just the
# day observation started, and comparing against them would invent a decay
# curve out of an arbitrary week — so those posts get a week-over-week trend
# instead. The tell is whether the post's first row is later than the rollup's
# own first day. `observed` is rollup coverage, NOT the post's age.
awk -F'\t' '
	function days(y, m, d,   era, yoe, doy, doe) {
		if (m <= 2) y--
		era = int((y >= 0 ? y : y - 399) / 400)
		yoe = y - era * 400
		doy = int((153 * (m + (m > 2 ? -3 : 9)) + 2) / 5) + d - 1
		doe = yoe * 365 + int(yoe / 4) - int(yoe / 100) + doy
		return era * 146097 + doe - 719468
	}
	{
		split($1, p, "-")
		n = days(p[1] + 0, p[2] + 0, p[3] + 0)
		if (n > today) today = n
		if (!begun) { start = n; begun = 1 } else if (n < start) start = n
		day[$2, n] = $3
		if (!($2 in first) || n < first[$2]) first[$2] = n
		path[$2] = 1
	}
	END {
		for (u in path) {
			# real posts only: not the section index, not its pagination
			if (u !~ /^\/posts\/./ || u ~ /^\/posts\/page\//) continue
			observed = today - first[u]
			if (observed < 21) continue           # no baseline to speak of yet
			launch = 0; recent = 0; prior = 0
			for (k in day) {
				split(k, f, SUBSEP)
				if (f[1] != u) continue
				n = f[2] + 0
				if (n < first[u] + 7)   launch += day[k]
				if (n > today - 7)      recent += day[k]
				else if (n > today - 14) prior += day[k]
			}
			if (recent + prior < 5) continue      # too quiet to say anything
			if (first[u] > start && launch >= 10)
				printf "C\t%d\t%d\t%.0f\t%d\t%s\n", recent, launch,
					recent * 100 / launch, observed, u
			else
				printf "S\t%d\t%d\t%s\t%d\t%s\n", recent, prior,
					(prior > 0 ? sprintf("%+.0f%%", (recent - prior) * 100 / prior) : "-"),
					observed, u
		}
	}' "$ROLLUP" > "$TMPD/residual"

CAUGHT=$(grep -c '^C' "$TMPD/residual")
STEADY=$(grep -c '^S' "$TMPD/residual")

if [ "$CAUGHT" -eq 0 ] && [ "$STEADY" -eq 0 ]; then
	echo ""
	echo "Residual readership"
	echo "  not enough history yet — needs a post observed for 21+ days"
fi

if [ "$CAUGHT" -gt 0 ]; then
	echo ""
	echo "Residual readership — posts whose launch the rollup caught"
	grep '^C' "$TMPD/residual" | cut -f2- | sort -rn | head -n 10 |
		awk -F'\t' 'BEGIN { printf "  %7s %8s %8s %9s  %s\n", "last 7", "launch", "sustain", "observed", "post" }
		            { printf "  %7d %8d %7d%% %8dd  %s\n", $1, $2, $3, $4, $5 }'
fi

if [ "$STEADY" -gt 0 ]; then
	echo ""
	echo "Steady readership — launch predates the rollup, so week over week"
	grep '^S' "$TMPD/residual" | cut -f2- | sort -rn | head -n 15 |
		awk -F'\t' 'BEGIN { printf "  %7s %8s %8s %9s  %s\n", "last 7", "prior 7", "trend", "observed", "post" }
		            { printf "  %7d %8d %8s %8dd  %s\n", $1, $2, $3, $4, $5 }'
fi
echo ""
echo "  (today is still accumulating, so \"last 7\" runs slightly low)"
echo ""
