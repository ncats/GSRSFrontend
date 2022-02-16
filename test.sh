#!/bin/sh

setup_git() {
  git clone --depth=50 https://github.com/ncats/gsrs-ci.git ncats/gsrs-ci
  ls -l
}


setup_git
