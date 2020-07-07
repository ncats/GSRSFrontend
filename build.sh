# the following is a set of commands that tend to work
# to reset things or start from scratch
# with the installation process 
rm -rf package-lock.json
rm -rf node_modules
rm -rf package.json
cp package.dev.json package.json
npm install
npm run build-file-select
npm run build-jsdraw-wrapper
npm run build-ketcher-wrapper
cp package.real.json package.json
npm install
npm audit fix
export NODE_OPTIONS="--max-old-space-size=8192"
