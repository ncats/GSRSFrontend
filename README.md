# GsrsClient

Technology stack

- [TypeScript](https://www.typescriptlang.org/)
- [Angular](https://angular.io/)
- [Angular CLI](https://github.com/angular/angular-cli)
- [Angular Material](https://material.angular.io/) based on [Google's Material Design methodology](https://material.io/design/)

## Requirements

Make sure to have these installed in order to run the application:

- [Node](https://nodejs.org/en/)
- [npm](https://www.npmjs.com/) - usually included in the node installation
- Angular CLI - on any command line run `npm install -g @angular/cli@latest`
 - On Windows 7, the angular cli "ng" executable will be located in this folder:
  - C:\Users\<USER>\AppData\Roaming\npm\
  - Hopefully, you've already added this folder to you windows environment path.
  - ... the ng.exe program will be used quite a bit.

## Prepare Specific Dependencies: Dojo

Dojo is a javascript toolkit library used by the JSDraw editor. To maximize performance, a custom version is needed. That custom version is zipped in the lib directory and needs to be unzipped. To do this,
just run:

```
cd lib
unzip dojo-jsdraw-custom.zip
```

This will create a folder that's used in other build scripts.

## Install Application Packages

After you have cloned the application to your local computer, open your favorite command line, navigate to the root directory (where the package.json is located), and run the following command:

- `npm install`


The first time you do this, it will take a while to download all required packages.

You should repeat this step whenever somebody adds a new package to the application. It's probably not a bad idea to run it whenever you start working on the application

## Perform a One-Time Build

You'll have to run the following commands the first time you work on the application to make sure a few libraries are built and ready to be used by the application:

- `ng build --prod file-select`
- `ng build --prod ketcher-wrapper`
- `ng build --prod jsdraw-wrapper`

## Run Application for Specific Environment

- Go the the package.json file and look at the scripts property to see what availabe commands exist
- The commands to run during development begin with "start"
- Identify the environment you want to run, open your favorite command line tool and run the script starting with "npm run"
 - So to run the fda local environment, you would run `npm run start:fda:local`
- After a few seconds of compiling the application, you're ready to view your application
- Open your browser and navigate to http://localhost:4200

# Development tools

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
