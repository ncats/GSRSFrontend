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



NOTE:
=====

There's actually a bug in dojox that causes issues, so the current build makes a change to a specific dojo file to avoid
a rather nasty infinite loop. The change is to the file `dojox/gfx/svg.js`. Specifically this block:

```
while(!_width){
//Yang: work around svgweb bug 417 -- http://code.google.com/p/svgweb/issues/detail?id=417
 if (_measurementNode.getBBox)
  _width = parseInt(_measurementNode.getBBox().width);
 else
  _width = 68;
}
```

Is replaces with this block:

```
if(!_width){
//Yang: work around svgweb bug 417 -- http://code.google.com/p/svgweb/issues/detail?id=417
 if (_measurementNode.getBBox){
  _width = parseInt(_measurementNode.getBBox().width);
 }
 if(!_width)_width=68;
}
```
It's unclear why the dojo authors decided to use a while block instead of an if, but if the `getBBox().width` call returns `0`,
it will actually get stuck in an infinite loop. It turns out when certain svg elements set to be invisible are called to be rendered,
they actually will have `0` width, so this is a rather serious error.
