documentation:
	cp ../shader_canvas/docs/documentation.md content/projects/shader-canvas

build: documentation
	zola build

publish:
	chmod -R a+rX ./public/
	rsync -rltzO --delete --no-perms --progress ./public/ \
	example.com:/var/www/htdocs/hugodaniel.com/
