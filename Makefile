documentation:
	cp ../shader_canvas/docs/documentation.md content/projects/shader-canvas
miniray:
	cp -R ../miniray/web/dist/* static/pages/miniray
boredom:
	cp -R ../boreDOM/landing-page/* static/pages/boreDOM

build: miniray boredom
	zola build

publish: build
	chmod -R a+rX ./public/
	rsync -rltzO --delete --no-perms --progress ./public/ \
	example.com:/var/www/htdocs/hugodaniel.com/
