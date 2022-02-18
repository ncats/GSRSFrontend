#!/bin/sh

setup_git() {
  git clone --depth=50 -b fda https://GsrsBot:${GIT_ACCESS_TOKEN}@github.com/ncats/gsrs-ci.git
  ls -l
  git stash
  cd gsrs-ci
  git status
  git checkout -b fda_travis_sync
  git merge fda
cp -r frontend/src/main/resources/static/substanceRelationshipVisualizer ./
rm -rf frontend/src/main/resources/static
mkdir frontend/src/main/resources/static
cp -r ../workspace/GSRSFrontend/dist/browser/* frontend/src/main/resources/static/
git add frontend/src/main/resources/static
git add -u 
git commit -m "travis test before build"
git push -u origin fda_travis_sync
ls


}


setup_git
