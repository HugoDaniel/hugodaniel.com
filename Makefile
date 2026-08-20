documentation:
	cp ../shader_canvas/docs/documentation.md content/projects/shader-canvas
miniray:
	cp -R ../miniray/web/dist/* static/pages/miniray
boredom:
	cp -R ../boreDOM/landing-page/* static/pages/boreDOM

sjon:
	pnpm --dir ../SJON/landing-page build
	rm -rf static/pages/sjon
	mkdir -p static/pages/sjon
	cp -R ../SJON/landing-page/dist/* static/pages/sjon/

colorpicker:
	cd ../color-picker-pro && npm run build -- --base=./
	rm -rf static/pages/color-picker-pro/app
	mkdir -p static/pages/color-picker-pro/app
	cp -R ../color-picker-pro/dist/. static/pages/color-picker-pro/app/

# The wgslender playground. `--base` is passed from here rather than pinned in
# the app: the app builds for `/` by default and the `/pages/wgslender/` prefix
# is a fact about this site, not about it. `cp -R dist/.` (not `dist/*`) so the
# two .wasm binaries and the dotfile-free asset tree all come across.
wgslender:
	pnpm --dir ../wgslender/web build --base=/pages/wgslender/
	rm -rf static/pages/wgslender
	mkdir -p static/pages/wgslender
	cp -R ../wgslender/web/dist/. static/pages/wgslender/

# The PNGine docs site (Astro Starlight). Unlike wgslender, `--base` is not
# passed here: site-pngine pins `base: '/pages/pngine'` in astro.config.mjs
# because its docs content writes that prefix into every internal link.
# Run its gates first (pnpm samples:check, llms:check, logo:check,
# fences:check) after any engine bump; they compare the snapshots in the repo
# against the sibling pngine checkout.
pngine:
	pnpm --dir ../site-pngine build
	rm -rf static/pages/pngine
	mkdir -p static/pages/pngine
	cp -R ../site-pngine/dist/. static/pages/pngine/

llms:
	bin/gen-llms.py

# Start a new draft post with today's date: make draft title="My Post Title"
draft:
	@bin/new-draft.py "$(title)"

# Week-to-date visitor stats from the server's httpd access log
stats:
	@ssh example.com 'sh -s' < bin/server-stats.sh

build: miniray boredom sjon colorpicker wgslender pngine llms
	zola build

.PHONY: capsule publish-capsule build sign-feed publish refresh-static documentation miniray boredom sjon colorpicker wgslender pngine llms draft stats

CAPSULE_OUT := public-capsule
CAPSULE_POSTS := \
	2026-07-15-the-end-of-creativity \
	2026-06-14-color-picking-oklch \
	2026-06-02-sjon \
	2026-05-25-s-rausch \
	2026-05-24-lost-in-the-middle \
	2026-02-17-redesigning-boredom-for-lx \
	2026-02-16-rip-rest-in-prompt \
	2026-01-22-claude-code-banned-me \
	2025-12-31-introducing-pngine \
	2025-12-30-miniray

capsule:
	rm -rf $(CAPSULE_OUT)
	mkdir -p $(CAPSULE_OUT)/posts
	cp capsule/*.gmi $(CAPSULE_OUT)/
	for slug in $(CAPSULE_POSTS); do \
		bin/md2gemini.py < content/posts/$$slug.md > $(CAPSULE_OUT)/posts/$$slug.gmi; \
	done

publish-capsule: capsule
	chmod -R a+rX $(CAPSULE_OUT)/
	rsync -rltzO --delete --no-perms --progress $(CAPSULE_OUT)/ \
	example.com:/var/gemini/hugodaniel.com/

sign-feed: build
	rm -f public/atom.xml.asc
	GNUPGHOME=$$HOME/.gnupg gpg --batch --yes -u mail@hugodaniel.com --detach-sign --armor public/atom.xml

publish: sign-feed
	chmod -R a+rX ./public/
	rsync -rltzO --delete --perms --progress ./public/ \
	example.com:/var/www/htdocs/hugodaniel.com/

# Push local static/ to the server, overwriting matching files but keeping
# anything already there that has no local counterpart (no --delete).
refresh-static:
	chmod -R a+rX ./static/
	rsync -rltzO --no-perms --progress ./static/ \
	example.com:/var/www/htdocs/hugodaniel.com/
