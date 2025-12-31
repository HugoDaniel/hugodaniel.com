documentation:
	cp ../shader_canvas/docs/documentation.md content/projects/shader-canvas
miniray:
	cp -R ../miniray/web/dist/* static/pages/miniray

build: miniray documentation
	zola build

publish:
	chmod -R a+rX ./public/
	rsync -rltzO --delete --no-perms --progress ./public/ \
	example.com:/var/www/htdocs/hugodaniel.com/
