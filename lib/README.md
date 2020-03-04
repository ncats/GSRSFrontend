To build a custom version of dojo for jsdraw (packaged with the right dependencies)

1. Acquire the dojo source release 1.16.1. At the time of this writing, you can do that with:

```
wget https://download.dojotoolkit.org/release-1.16.1/dojo-release-1.16.1-src.zip
unzip dojo-release-1.16.1-src.zip
```

2. Build the custom form of dojo with the provided profile, and place it in this directory. This can be done with:
```
./dojo-release-1.16.1-src/util/buildscripts/build.sh action=release profileFile=jsdraw.profile.js
mv ./dojo-release-1.16.1-src/release/dojo ./dojo-custom-jsdraw
```

3. Copy the contents of the dojo-custom-jsdraw folder to the source folder needed. This should be done already as part of existing build scripts.

