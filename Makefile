# Makefile to compile and run tests with phantomjs
#
# "scyt/nodejs" container contains all necessary dependencies to run nodejs with npm, bower and phantomjs browser.
#
# The command below does the following steps:
# - Runs the 10.4.16.33/scytl/nodejs container (-rm = The container is removed once the execution is finished)
# - Mounts the project (current dir) to container's /app/ directory (with write privileges)
# - Sets http_proxy (Otherwise ONE machines cannot fetch depedencies. http_proxy needs to be disabled to non-ONE machines, since the proxy is only visible by ONE)
# - Runs 'make -B compile' _inside_ the container which: (-B is to force rebuild at Makefile)
#   - Runs npm install
#   - Runs bower install (passes --allow-root, otherwise bower fails with root user)
#   - Runs grunt (Which use karma to launch firefox for testing, http_proxy is unset so that firefox can connect to karma for testing)

# By default docker target is executed
all:  run

# This is run on the host to launch the container
ci: pull run

pull:
	docker pull 10.4.16.33/scytl/nodejs

run:
	docker run -e GIT_COMMIT=$(GIT_COMMIT) -e BUILD_NUMBER=$(BUILD_NUMBER) -e BUILD_ID=$(BUILD_ID) -e http_proxy=http://hproxy.scytl.net:8080 -e https_proxy=http://hproxy.scytl.net:8080 -P -rm -a=stdout -v "`pwd`:/app/" -p 5999 -w /app -i -t 10.4.16.33/scytl/nodejs make -B compile

# This is run on the container to build the project
compile:
	npm install --unsafe-perm
	bower install --allow-root
	npm run release
release_patch:
	npm install --unsafe-perm
	bower install --allow-root
	npm run patch
	npm run release
	git add bower.json package.json
	git commit -m "new patch release"
	git push master master
	git push `git remote show` `git tag | sort -V | tail -1`
	npm run nexus
release_minor:
	npm install --unsafe-perm
	bower install --allow-root
	npm run minor
	npm run release
	git add bower.json package.json
	git commit -m "new minor release"
	git push master master
	git push `git remote show` `git tag | sort -V | tail -1`
	npm run nexus
release_major:
	npm install --unsafe-perm
	bower install --allow-root
	npm run major
	npm run release
	git add bower.json package.json
	git commit -m "new major release"
	git push master master
	git push `git remote show` `git tag | sort -V | tail -1`
	npm run nexus
install:
	npm install
	bower install
clean:
	rm -rf node_modules/
	rm -rf bower_components/
