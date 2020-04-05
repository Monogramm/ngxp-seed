# NGXP Seed [![Build Status](https://secure.travis-ci.org/Monogramm/ngxp-seed.png)](https://travis-ci.org/Monogramm/ngxp-seed)

A "simple" starter project to create native mobile and web apps with single shared code base using angular and nativescript. It is designed to plug to the [spring-rest-api-starter](https://github.com/Monogramm/spring-rest-api-starter) backend.

The frontend is based on the [nativescript-angular-web-starter](https://github.com/shripalsoni04/nativescript-angular-web-starter) project.

Check this [Open Souce Cross Platform Quotes Application](https://github.com/shripalsoni04/ngxp-quotes-app) for reference, which is made with the exact same architecture as this starter project.

## Prerequisites
0. Globally installed
  * [Git](https://git-scm.com/)
  * [Node.js](https://nodejs.org) **12** & [npm](https://www.npmjs.com/)
  * `gcc` & `g++`
  * `make`
1. Globally installed Angular CLI - `npm install -g @angular/cli@8`
2. Globally installed NativeScript  - `npm install -g nativescript@6`
3. (optional). Mac OS to build iOS app and Android emulator or device for building Android app.

## Installation
1. `git clone https://github.com/Monogramm/ngxp-seed.git`
2. `cd ngxp-seed`
3. `npm run ngxp-install`
4.  Make sure to edit the local adress of your backend in [backend.service.ts](x-shared/app/core/backend.service.ts).

## Run Web application
`npm run start` - This will start the application at http://localhost:4200 or http://localhost:4200/webpack-dev-server/. 

## Run iOS Application
- First start the simulator or connect the iOS device.
- Execute `npm run start.ios` 
- **Note** - If you are using XCode8 then you need to set the DEVELPMENT_TEAM. There are two ways to set it.
  1. Using XCode
      - After executing `npm run start.ios` command, open project wordspace file nativescript/platforms/ios/nativescript.xcworkspace in XCode
      - Click on nativescript project in XCode and set Team from General Tab.
      - The issue with thie approach is, you need to set it everytime you remove and add the iOS platform.
  2. From build.xconfig (preferable)
      - Open nativescript/app/App_Resources/iOS/build.xconfig file.
      - Uncomment `DEVELOPMENT_TEAM = YOUR_TEAM_ID;` line, and enter your team id.

## Run Android Application
- First start the emulator or connect the iOS device.
- Execute `npm run start.android`

## Project Folder Structure
**nativescript**

This contains a nativescript project for creating Android/iOS applications.

**tools**

This contains scripts useful during development.

**web**

This contains nothing but a web project created using `angular-cli`.

**x-shared**

All the code/assets which are common to both web and nativescript projects resides here. This folder is symlinked to `nativescript/app/x-shared` and `web/src/x-shared` folder. So changes in `x-shared` folder from any of the three locations will get reflected in other two folders.


## Commands
You can execute any valid command of angular-cli from `web/` folder and any valid command of nativescript-cli from `nativescript/` folder.
For convenince below are the commands which you can execute from root directory.

### Common
| Command                | Description                                                                                                                          |
|------------------------|--------------------------------------------------------------------------------------------------------------------------------------|
| npm run ngxp-install   | Installs dependencies of web and nativescript applications. Creates symlink of x-shared folder in both web and nativescript project. |
| npm run tslint         | Calls TSLint globally.                                                                                                               |

### Web Application
| Command                | Description                                                                                   |
|------------------------|-----------------------------------------------------------------------------------------------|
| npm start              | Starts web application at http://localhost:4200                                               |
| npm run start.prod     | Starts web application in production mode. Runs uglification and minification.                |
| npm run start.aot      | Performs AOT for web application templates and starts web application.                        |
| npm run start.aot.prod | Performs AOT, minification, uglification and starts web application.                          |
| npm run build          | Builds the web application and copy the built project in web/dist folder.                     |
| npm run build.prod     | Builds the web application in production mode and copy the built project in web/dist folder.  |
| npm run build.aot      | Performs AOT, build the project and then copy the built project in web/dist folder.           |
| npm run build.aot.prod | Performs AOT, prepares production build and then copy the built project in web/dist folder.   |
| npm test               | Runs web application and x-shared unit test cases. It will not generate code coverage report. |
| npm run test-cc        | Runs web application and x-shared unit test cases and generates code coverage report.         |

### Nativescript Application
| Command                  | Description                                                                       |
|--------------------------|-----------------------------------------------------------------------------------|
| npm run build.ios        | Builds application on iOS emulator/device                                         |
| npm run build.android    | Builds application on Android emulator/device                                     |
| npm run start.ios        | Runs application on iOS emulator/device                                           |
| npm run start.android    | Runs application on Android emulator/device                                       |
| npm run debug.ios        | Debugs application on iOS emulator/device                                         |
| npm run debug.android    | Debugs application on Android emulator/device                                     |
| npm run clean.ios        | Cleans application on iOS emulator/device                                         |
| npm run clean.android    | Cleans application on Android emulator/device                                     |
| npm run restart.ios      | Cleans and restarts application on iOS emulator/device                            |
| npm run restart.android  | Cleans and restarts application on Android emulator/device                        |
| npm run test.ios         | Runs tests on iOS emulator/device. It will not generate code coverage report.     |
| npm run test.android     | Runs tests on Android emulator/device. It will not generate code coverage report. |

## FAQ
### How to change package/bundle id for Android/iOS apps?
To change the package/bundle id you need to do changes in below files.

1. `nativescript/package.json`
- Change `id` property of `nativescript` object as follows:

```
"nativescript": {
    "id": "com.domain.yourapp"
}
```

2. Open `nativescript/app/App_Resources/Android/app.gradle` file and change `applicationId` as shown below:

```
android {
  defaultConfig {
    ...
    applicationId = "com.domain.yourapp"
  }
  ...
}
```

### How to change Android and iOS Application Display Name?
**For Android**, open `nativescript/app/App_Resources/Android/values/strings.xml` file and write your app name where `Nativescript Angular Web Starter` is written:

```
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <string name="app_name">Nativescript Angular Web Starter</string>
    <string name="title_activity_kimera">Nativescript Angular Web Starter</string>
</resources>
```

**For iOS**, open `nativescript/app/App_Resources/iOS/info.plist` file and change value of `CFBundleDisplayName` and `CFBundleName` to your app name:

```
<dict>
  ...
  <key>CFBundleDisplayName</key>
	<string>Nativescript Angular Web Starter</string>
  <key>CFBundleName</key>
	<string>NativescriptAngularWebStarter</string>
  ...
</dict>
```
### How to use angular dependencies from common node_modules folder. (Not tested properly yet!)
Currently you can see that for web project, angular modules are there as dependencies in common package.json and at web/package.json. So currently to update version of angular modules for web project,
you need to update version at both of these package.json files. To avoid this, you can add path mapping in web project's tsconfig.json file as shown below:

`web/src/tsconfig.json`
```
"paths": {
  "@angular/*": ["../../node_modules/@angular/*"]
}
```

Once you add above configuration, the web project will try to find the @angular pacakges from common node_modules folder.

## Attributes
1. [Angular Framework](https://angular.io/)
2. [Nativescript Framework](http://nativescript.org/)
3. [Nativescript Core Theme](https://github.com/NativeScript/theme)
4. [nativescript-swiss-army-knife](https://github.com/TheOriginalJosh/nativescript-swiss-army-knife)
5. `tools/install.js` from [angular-advanced-seed](https://github.com/NathanWalker/angular-seed-advanced)

## Awesome Contributors
* [madmath03](https://github.com/madmath03)
* [ebacem](https://github.com/ebacem)
