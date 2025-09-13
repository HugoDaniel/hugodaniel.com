documentation:
	cp ../shader_canvas/docs/documentation.md content/projects/shader-canvas

build: documentation
	zola build

publish: build
	cp -r public /tmp/public-copy
	# git checkout --orphan gh-pages
	git checkout gh-pages
	git rm -rf .
	cp -r /tmp/public-copy/* .
	git add .
	git commit -m "Deploy to gh-pages"
	git push origin gh-pages --force
	git checkout main

