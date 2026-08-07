#!/bin/sh
# Visitor stats for hugodaniel.com, executed ON the OpenBSD server.
# Invoked by `make stats` as: ssh example.com 'sh -s' < bin/server-stats.sh
#
# httpd logs with `log style forwarded` (relayd sits in front), so after
# splitting a line on '"' the fields are:
#   $2 = request line    $3 = status + bytes    $4 = referrer
#   $6 = user agent      $7 = real client IP
#
# The log rotates weekly (Saturday), so everything below is week-to-date.

LOG=/var/www/logs/access-hugodaniel.com
TODAY=$(date '+%d/%b/%Y')
BOTS='bot|crawl|spider|scan|curl|wget|python|go-http|java|feed|rss|reader|monitor|uptime|probe|headless|preview|fetch|archive|scrape'

TMP=$(mktemp) || exit 1
trap 'rm -f "$TMP"' EXIT

# One line per human page view: "day ip path".
# A page view = GET + 200, not a static asset, UA not matching $BOTS.
doas cat "$LOG" | awk -F'"' -v bots="$BOTS" '
	tolower($6) ~ bots { next }
	{
		split($2, r, " "); if (r[1] != "GET") next
		split($3, s, " "); if (s[1] != "200") next
		path = r[2]; sub(/\?.*/, "", path)
		if (path ~ /\.(css|js|mjs|png|jpe?g|webp|gif|svg|ico|woff2?|ttf|otf|xml|txt|json|gz|asc|pdf|mp4|webm|zip|wasm|map)$/) next
		split($7, ip, " "); split($1, d, "[")
		print substr(d[2], 1, 11), ip[1], path
	}' > "$TMP"

FIRST_DAY=$(head -n 1 "$TMP" | cut -d' ' -f1)
VIEWS=$(wc -l < "$TMP" | tr -d ' ')
UNIQ=$(cut -d' ' -f2 "$TMP" | sort -u | wc -l | tr -d ' ')
TVIEWS=$(grep "^$TODAY" "$TMP" | wc -l | tr -d ' ')
TUNIQ=$(grep "^$TODAY" "$TMP" | cut -d' ' -f2 | sort -u | wc -l | tr -d ' ')
REQS=$(doas cat "$LOG" | wc -l | tr -d ' ')
FEED=$(doas cat "$LOG" | awk -F'"' '
	{
		split($2, r, " ")
		if (r[2] ~ /^\/atom\.xml/) { split($7, ip, " "); print ip[1] }
	}' | sort -u | wc -l | tr -d ' ')

echo ""
echo "hugodaniel.com — since $FIRST_DAY (log rotates Saturday)"
echo ""
echo "  page views       $VIEWS   (today: $TVIEWS)"
echo "  unique visitors  $UNIQ   (today: $TUNIQ)"
echo "  feed readers     $FEED unique IPs fetched /atom.xml"
echo "  total requests   $REQS (incl. bots and assets)"

echo ""
echo "Views per day"
cut -d' ' -f1 "$TMP" | uniq -c | awk '{ printf "  %s  %6d\n", $2, $1 }'

echo ""
echo "Top pages"
cut -d' ' -f3 "$TMP" | sort | uniq -c | sort -rn | head -n 10 |
	awk '{ printf "  %6d  %s\n", $1, $2 }'

echo ""
echo "Top referrers"
doas cat "$LOG" | awk -F'"' -v bots="$BOTS" '
	tolower($6) ~ bots { next }
	$4 != "" && $4 !~ /hugodaniel\.com/ {
		split($4, p, "/"); if (p[3] != "") print p[3]
	}' | sort | uniq -c | sort -rn | head -n 10 |
	awk '{ printf "  %6d  %s\n", $1, $2 }'

echo ""
echo "Status codes"
doas cat "$LOG" | awk -F'"' '{ split($3, s, " "); if (s[1] != "") print s[1] }' |
	sort | uniq -c | sort -rn | awk '{ printf "  %s  %6d\n", $2, $1 }'
echo ""
