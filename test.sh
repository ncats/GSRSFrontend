setup_git() {
  cd ../
ls
  git clone --depth=50 -b fda_travis_sync https://GsrsBot:${GIT_ACCESS_TOKEN}@github.com/ncats/gsrs-ci.git

ls
cd gsrs-ci
git init
git status
git checkout fda_travis_sync
  git fetch
  git pull
  git merge fda
cp -r frontend/src/main/resources/static/substanceRelationshipVisualizer ./
rm -rf frontend/src/main/resources/static
mkdir frontend/src/main/resources/static
cp -r ../GSRSFrontend/dist/browser/* frontend/src/main/resources/static/
cp -r ./substanceRelationshipVisualizer frontend/src/main/resources/static/
rm -rf ./substanceRelationshipVisualizer
git add frontend/src/main/resources/static
git add -u 
git commit -m "travis test before build"
git status
ls
git push -u origin fda_travis_sync



}


setup_git
