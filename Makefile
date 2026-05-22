documentation:
	cp ../shader_canvas/docs/documentation.md content/projects/shader-canvas
miniray:
	cp -R ../miniray/web/dist/* static/pages/miniray
boredom:
	cp -R ../boreDOM/landing-page/* static/pages/boreDOM

build: miniray boredom
	zola build

.PHONY: capsule publish-capsule build sign-feed publish documentation miniray boredom

CAPSULE_OUT := public-capsule
CAPSULE_POSTS := \
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
	rsync -rltzO --delete --no-perms --progress ./public/ \
	example.com:/var/www/htdocs/hugodaniel.com/
