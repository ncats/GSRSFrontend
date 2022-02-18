#!/bin/sh

setup_git() {
  git clone --depth=50 -b fda https://GsrsBot:${GIT_ACCESS_TOKEN}@github.com/ncats/gsrs-ci.git
  ls -l
  git stash
  cd gsrs-ci
  git status
cp -r frontend/src/main/resources/static/substanceRelationshipVisualizer ./
rm -rf frontend/src/main/resources/static
mkdir frontend/src/main/resources/static
ls


}


setup_git
