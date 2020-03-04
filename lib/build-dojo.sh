rm -rf dojo-custom-jsdraw
./dojo-release-1.16.1-src/util/buildscripts/build.sh action=release profileFile=jsdraw.profile.js
mv ./dojo-release-1.16.1-src/release/dojo ./dojo-custom-jsdraw
