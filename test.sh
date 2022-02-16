#!/bin/sh

setup_git() {
  git clone --depth=50 https://GsrsBot:${GIT_ACCESS_TOKEN}@github.com/ncats/gsrs-ci.git
  ls -l
  git stash
  cd gsrs-ci
git checkout fda
git pull origin fda
git checkout fda_travis_sync
git merge fda
cp -r frontend/src/main/resources/static/substanceRelationshipVisualizer ./
rm -rf frontend/src/main/resources/static
mkdir frontend/src/main/resources/static
ls


}


setup_git
