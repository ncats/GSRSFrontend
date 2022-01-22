GsrsClient
Technology stack

TypeScript
Angular
Angular CLI
Angular Material based on Google's Material Design methodology
Getting Started Overview
The full steps for a complete build are as follows, each will be given in more detail:

Step 1 [Required] Obtain the required software dependencies (node, npm, and angular CLI, as mentioned above)
Step 2 [Optional] Clear any previous build files, locks, and local dependencies (this step is not typically necessary, but it ensures constency if there were previous local builds)
Step 3 [Optional] Prepare dojo dependencies and place in zip file lib/dojo-custom-jsdraw.zip (this dojo build is already prepared by default so this step is optional)
Step 4 [Required] Prepare fundamental dependencies by doing npm install with package.dev.json file.
Step 5 [Required] Prepare extended one-time build dependencies using specific build commands
Step 6 [Required] Build, run or test the codebase as normal
If you are using a bash terminal, steps 2-5 can be accomplished by simply running:

bash build.sh
Step 1: Software Requirements
Make sure to have these installed in order to run the application:

Node
npm - usually included in the node installation
Angular CLI - on any command line run npm install -g @angular/cli@latest
The angular cli "ng" executable will be located in this folder:
C:\Users\<USER>\AppData\Roaming\npm\ (Windows 7)
~/.npm-global/bin/ (linux)
Note: For best results, this path should be added to your windows/bash path as the command will be used a lot.
The angular CLI tool currently needs to have build-angular version <=0.803.25
To force this installation after an audit fix run npm i @angular-devkit/build-angular@0.803.25
Step 2 [Optional]: Clear any Previous Build Files
This step isn't always necessary, but can be useful when attempting to force a de novo build. The following files should be removed from the root directory:

package-lock.json
node_modules
package.json
Step 3 [Optional]: Prepare Custom Dojo Dependency
This step isn't typically necessary. The purpose of this step is to prepare a slimmed down version of dojo for the jsdraw structure editor component, but the default build already has a form of this prepackaged. To perform a more custom dojo build, read the lib/README.md file and follow its instructions.

Step 4: Install Fundamental Dependencies
This step acquires the "base" dependencies needed to do further builds. The full real package.json file would have a cyclic dependency issue if we attempted to install using it directly, so we first build only the bare minimum pieces needed to build the other dependencies. This is accomplished by using a trimmed down version of the package.json file named package.dev.json. The following commands will make this happen:

bash:

cp package.dev.json package.json
npm install
windows CMD:

copy package.dev.json package.json
npm install
Step 5: Perform a One-Time Build of Dependencies
You'll have to run the following commands the first time you work on the application to make sure a few libraries are built and ready to be used by the application:

npm run build-file-select
npm run build-jsdraw-wrapper
npm run build-ketcher-wrapper
This MUST be done while the package.dev.json file is being used as package.json, as in step 4. Once this is done, you then replace the package.json file with package.real.json to complete the preperation. This can be accomplished with the following commands:

bash:

cp package.real.json package.json
npm install
windows CMD:

copy package.real.json package.json
npm install
Doing the install at this time may reveal some elements that suggest an audit fix. While this can be done, newer versions of the angular build tool are not compatible with the current build process, so the specific <=0.803.25 version must be forced. To both do a basic audit fix and force this version, you can run the following commands (either windows CMD or bash):

npm audit fix
npm i @angular-devkit/build-angular@0.803.25
Step 6: Run Application for Specific Environment
Go the the package.json file and look at the scripts property to see what availabe commands exist
The commands to run during development begin with "start"
Identify the environment you want to run, open your favorite command line tool and run the script starting with "npm run"
So to run the public local environment, you would run npm run start:gsrs:local
After a few seconds of compiling the application, you're ready to view your application
Open your browser and navigate to http://localhost:4200
Development tools
Code scaffolding
Run ng generate component component-name to generate a new component. You can also use ng generate directive|pipe|service|class|guard|interface|enum|module.

Running unit tests
Run ng test to execute the unit tests via Karma.

Running end-to-end tests
Run ng e2e to execute the end-to-end tests via Protractor.

Further help
To get more help on the Angular CLI use ng help or go check out the Angular CLI README.