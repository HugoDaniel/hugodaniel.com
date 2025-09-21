documentation:
	cp ../shader_canvas/docs/documentation.md content/projects/shader-canvas

build: documentation
	zola build

publish: 
	rsync -rlptzO --delete --no-perms --progress ./public/ \
	example.com:/var/www/htdocs/hugodaniel.com/
