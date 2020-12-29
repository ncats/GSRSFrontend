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

# Audit fix step is unnecessary here, as there are some
# other dependency issues that can arise
npm audit fix

# Since the audit fix sometimes forces an upgrade
# of the build tool, this pushes it back
npm i @angular-devkit/build-angular@0.803.25

export NODE_OPTIONS="--max-old-space-size=8192"
