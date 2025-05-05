# the following is a set of commands that tend to work
# to reset things or start from scratch
# with the installation process 
rm -rf package-lock.json
rm -rf node_modules
npm install --legacy-peer-deps
export NODE_OPTIONS="--max-old-space-size=8192"

