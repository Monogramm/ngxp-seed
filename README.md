# NGXP Starter [![Build Status](https://secure.travis-ci.org/Monogramm/ngxp-seed.png)](https://travis-ci.org/Monogramm/ngxp-seed)

A "simple" starter project to create native mobile and web apps with single shared code base using angular and nativescript. It is designed to plug to the [spring-rest-api-starter](https://github.com/Monogramm/spring-rest-api-starter) backend.

The frontend is based on the [nativescript-angular-web-starter](https://github.com/shripalsoni04/nativescript-angular-web-starter) project.

## Prerequisites
0. Globally installed [Git](https://git-scm.com/), [Node.js](https://nodejs.org), [npm](https://www.npmjs.com/)
1. Globally installed Angular CLI - `npm install -g @angular/cli`
2. Globally installed NativeScript  - `npm install -g nativescript --unsafe-perm`
3. (optional). Mac OS to build iOS app and Android emulator or device for building Android app.

## Installation
1. `git clone https://github.com/Monogramm/ngxp-seed.git`
2. `cd ngxp-seed`
3. `npm install`
4.  Make sure to edit the local adress of your backend in [environments/](environments/).

## Run Web application
`npm run start` - This will start the application at http://localhost:4200. 

## Run iOS Application
- First start the simulator or connect the iOS device.
- Execute `npm run start.ios` 
- **Note** - If you are using XCode8 then you need to set the DEVELPMENT_TEAM. There are two ways to set it.
  1. Using XCode
      - After executing `npm run start.ios` command, open project wordspace file platforms/ios/nativescript.xcworkspace in XCode
      - Click on nativescript project in XCode and set Team from General Tab.
      - The issue with thie approach is, you need to set it everytime you remove and add the iOS platform.
  2. From build.xconfig (preferable)
      - Open App_Resources/iOS/build.xconfig file.
      - Uncomment `DEVELOPMENT_TEAM = YOUR_TEAM_ID;` line, and enter your team id.

## Run Android Application
- First start the emulator or connect the iOS device.
- Execute `npm run start.android`

## Project Folder Structure
**src**

This contains the shared code source of the nativescript and angular project for creating respectively Android/iOS and Web applications.

**e2e**

This contains the end to end tests source code.

**nginx**

This contains a sample configuration for NGinx. This configuration is imported when building a docker image of your Angular Web Application.
To do so, run the following commands:
* `npm run build.prod`
* `docker build`

**App_Resources**

This contains the end to end tests source code.


## Commands
You can execute any valid command of angular-cli and any valid command of nativescript-cli from root folder.
For convenince below are the commands which you can execute from root directory.

### Common
| Command                | Description                                                                               |
|------------------------|-------------------------------------------------------------------------------------------|
| npm run tslint         | Calls TSLint globally.                                                                    |

### Web Application
| Command                | Description                                                                               |
|------------------------|-------------------------------------------------------------------------------------------|
| npm start              | Starts web application at http://localhost:4200                                           |
| npm run build          | Builds the web application and copy the built project in dist folder.                     |
| npm run build.prod     | Performs AOT, prepares production build and then copy the built project in dist folder.   |
| npm test               | Runs web application unit test cases. It will not generate code coverage report.          |
| npm run test-cc        | Runs web application unit test cases and generates code coverage report.                  |

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
To change the package/bundle id, you need to do changes in below files.

1. `package.json`
- Change `id` property of `nativescript` object as follows:

```
"nativescript": {
    "id": "com.domain.yourapp"
}
```

2. Open `App_Resources/Android/app.gradle` file and change `applicationId` as shown below:

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
**For Android**, open `App_Resources/Android/values/strings.xml` file and write your app name where `Nativescript Angular Web Starter` is written:

```xml
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <string name="app_name">Nativescript Angular Web Starter</string>
    <string name="title_activity_kimera">Nativescript Angular Web Starter</string>
</resources>
```

**For iOS**, open `App_Resources/iOS/info.plist` file and change value of `CFBundleDisplayName` and `CFBundleName` to your app name:

```xml
<dict>
  <!-- ... -->
  <key>CFBundleDisplayName</key>
	<string>Nativescript Angular Web Starter</string>
  <key>CFBundleName</key>
	<string>NativescriptAngularWebStarter</string>
  <!-- ... -->
</dict>
```

## Attributes
1. [Angular Framework](https://angular.io/)
2. [Nativescript Framework](http://nativescript.org/)
3. [Nativescript Core Theme](https://github.com/NativeScript/theme)

## Awesome Contributors
* [madmath03](https://github.com/madmath03)
* [ebacem](https://github.com/ebacem)
