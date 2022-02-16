#!/bin/sh

setup_git() {
  git clone --depth=50 https://GsrsBot:${GIT_ACCESS_TOKEN}@github.com/ncats/gsrs-ci.git
  ls -l
}


setup_git
