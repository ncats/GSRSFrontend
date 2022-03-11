setup_git() {
  cd ../
ls
  git clone https://GsrsBot:${GIT_ACCESS_TOKEN}@github.com/ncats/gsrs-ci.git
cd gsrs-ci
ls
  echo "git status"
git status
git fetch
echo "now git branch"
git branch -a
git status
git checkout -b branch remote/fda_travis_sync
  git pull
  git merge fda
  cd gsrs-ci

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
