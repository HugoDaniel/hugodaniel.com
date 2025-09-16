documentation:
	cp ../shader_canvas/docs/documentation.md content/projects/shader-canvas

build: documentation
	zola build

publish: 
	@if [ -n "$$(git status --porcelain)" ]; then \
		echo "Error: You have uncommitted changes. Please commit or stash them first."; \
		exit 1; \
	fi
	mv public /tmp/public-copy
	# git checkout --orphan gh-pages
	git checkout gh-pages
	if [ -f CNAME ]; then cp CNAME /tmp/CNAME-backup; fi
	git rm -rf .
	cp -r /tmp/public-copy/* .
	if [ -f /tmp/CNAME-backup ]; then cp /tmp/CNAME-backup CNAME; fi
	git add .
	git commit -m "Deploy to gh-pages"
	git push origin gh-pages --force
	git checkout main
	mv /tmp/public-copy public
	rm -f /tmp/CNAME-backup

