# GsrsClient

Technology stack

- [TypeScript](https://www.typescriptlang.org/)
- [Angular](https://angular.io/)
- [Angular CLI](https://github.com/angular/angular-cli)
- [Angular Material](https://material.angular.io/) based on [Google's Material Design methodology](https://material.io/design/)

## Getting Started Overview

The full steps for a complete build are as follows, each will be given in more detail:

1. Step 1 [Required] Obtain the required software dependencies (node, npm, and angular CLI, as mentioned above)
2. Step 2 [Optional] Clear any previous build files, locks, and local dependencies (this step is not typically necessary, but it ensures constency if there were previous local builds)
3. Step 3 [Optional] Prepare dojo dependencies and place in zip file `lib/dojo-custom-jsdraw.zip` (this dojo build is already prepared by default so this step is optional)
4. Step 4 [Required] Prepare fundamental dependencies by running `npm install`.
5. Step 5 [Required] Prepare extended one-time build dependencies using specific build commands
6. Step 6 [Required] Build, run or test the codebase as normal

If you are using a bash terminal, steps 2-5 can be accomplished by simply running:
```
bash build.sh
```

## Step 1: Software Requirements

Make sure to have these installed in order to run the application:

* [Node](https://nodejs.org/en/) - version 20.19.0 (see `.github/workflows/binary_build.yml` for the version used in CI)
* [npm](https://www.npmjs.com/) - usually included in the node installation
* Angular CLI - on any command line run `npm install -g @angular/cli@20`
 * The angular cli "ng" executable will be located in this folder:
   * `C:\Users\<USER>\AppData\Roaming\npm\` (Windows 7)
   * `~/.npm-global/bin/` (linux)
   * Note: For best results, this path should be added to your windows/bash
     path as the command will be used a lot.
   * This project currently targets Angular 20, so `@angular/cli` and `@angular-devkit/build-angular` should match that major version (`^20.x`)
  
## Step 2 [Optional]: Clear any Previous Build Files

This step isn't always necessary, but can be useful when attempting to force a de novo build. The following files should be removed from the root directory:

```
package-lock.json
node_modules
```

## Step 3 [Optional]: Prepare Custom Dojo Dependency

This step isn't typically necessary. The purpose of this step is to prepare a slimmed down version of dojo for the jsdraw structure editor component, but the default build already has a form of this prepackaged. To perform a more custom dojo build, read the `lib/README.md` file and follow its instructions.


## Step 4: Install Dependencies

You'll have to run the following commands the first time you work on the application to make sure a few libraries are built and ready to be used by the application:

bash:
```
npm install
```

## Step 5: Run Application for Specific Environment

- Go the the package.json file and look at the scripts property to see what availabe commands exist
- The commands to run during development begin with "start"
- Identify the environment you want to run, open your favorite command line tool and run the script starting with "npm run"
 - So to run the public local environment, you would run `npm run start:gsrs:local`
- After a few seconds of compiling the application, you're ready to view your application
- Open your browser and navigate to http://localhost:4200

You'll also need to to make adjustments to the API base urls and Gateway.  See [here](https://github.com/ncats/gsrs3-main-deployment#optionally-use-development-mode-for-the-frontend-in-the-local-embedded-deployment) details.

If you have a need for a different environment, you can create a new one based on the existing pattern.


## Troubleshooting

GSRSFrontend uses dart `sass` (not `node-sass`) for compiling styles, so there are no native-binding/node-version compatibility issues to manage. The version in use can be checked/changed in the root `package.json` file under the `sass` dependency.

# Development tools


## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

The `e2e` npm script remains, but no Angular end-to-end test target or tooling is currently configured for this project.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

