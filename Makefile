documentation:
	cp ../../projects/shader_canvas/docs/documentation.md content/projects/shader-canvas

build: documentation
	zola build
