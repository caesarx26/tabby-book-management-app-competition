# for building app for android 
- make sure to configure your env variables in the eas.json for development and production
```json
 "env": {
        "EXPO_PUBLIC_CPU_US_API_URL": "https://examplecpu.com",
        "EXPO_PUBLIC_GPU_API_URL": "https://examplegpu.com"
      }
```
## to make apk for testing
```bash
eas build --platform android --profile development
```
## to make AAB for google play store
```bash
eas build --platform android --profile production
```

# for building app for ios 
- apple developer account needed and $99 every year to keep :cry:

# Before setting up project 😢
This is what you need to do before getting started with the app like installing
the package manager and wsl. 

## install vs code 
- [link to install vs code](https://code.visualstudio.com/)

## install wsl 
- [steps to install wsl](https://learn.microsoft.com/en-us/windows/wsl/install)
- [or install through windows store](https://apps.microsoft.com/detail/9pdxgncfsczv?hl=en-us&gl=US)

## setup wsl enviornment
1. open wsl ubunutu terminal and create username and password
2. update ubuntu
```bash
   sudo apt update
```
3. install git 
```bash
   sudo apt install git
```
4. set git global username and email
```bash
   git config --global user.name "github_username"
   git config --global user.email "github.email@example.com"
 ```

## install Node.js on wsl (Reccomeneded)
- [steps to to install node on wsl](https://learn.microsoft.com/en-us/windows/dev-environment/javascript/nodejs-on-wsl)

## install and setup android studio on windows 
- [download android studio](https://developer.android.com/studio)
- when installing for the sdk platform make sure Andriod 15 and Andriod 14 are checked
- then for sdk tools make sure Andriod Emulator, Android Emulator hypervisor driver (installer), Android SDK Platform-Tools, and Android SDK Build-Tools 35 are checked 
- can add sdk stuff later as well 
- create a default project and wait a bit until you can run it then you will have an android emulator running 
- note: make sure android emulator is connected to the internet
   - go into the android emulator through andriod studio 
   - then through the emulator open the settings app and make sure android wifi is connected
   - if it is not connecting try disconnecting and reconnecting (needed to run expo app on the emulator)

## change terminal settings on android studio
- setup wsl terminal on android studio: 
- go to settings and in tools go to terminal 
- in the terminal settings for the shell path put: 
```
     C:\Windows\System32\wsl.exe
```
- apply changes and press ok 

## connecting android sdk on windows to wsl 😐
1. in wsl run this command, but find out your name as a user on your windows machine and fill in
```bash
echo -e "\n# Android\nexport ANDROID_HOME=/mnt/c/Users/<name>/AppData/Local/Android/Sdk\nexport WSLENV=ANDROID_HOME/p" >> $HOME/.bashrc && source $HOME/.bashrc
 ```
2. in wsl run this command, but also find out your name as a user on your windows machine and fill in
```bash
sudo cp /mnt/c/Users/<name>/AppData/Local/Android/sdk/platform-tools/adb.exe /mnt/c/Users/<name>/AppData/Local/Android/sdk/platform-tools/adb
 ```

 3. restart android studio and open project and run emulator

- [can also follow this guide mostly if there is trouble](https://medium.com/@akbarimo/developing-react-native-with-expo-android-emulators-on-wsl2-linux-subsystem-ad5a8b0fa23c)

## or you can install node.js on windows instead of wsl
[windows guide](https://www.freecodecamp.org/news/nvm-for-windows-how-to-download-and-install-node-version-manager-in-windows-10/)

# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started 
- after cloning the project go to the directory where tabby is in (if you are using wsl, you can open vs code in the current directory you are in by using this command) 
```bash
   code .
```

- make .env file to be able to connect with the server. Look at the server folder to see how to setup and deploy the backend
- look at .env.example to see how enviornment variables are setup (2 environment variables expected)
- there is an enviornment variable for a gpu url (used for scan_cover & scan_shelf) and a cpu url (used for search & recommendations)
- if only using 1 backend url can just set both urls to the same value just need to make sure searches and recommendations are done by a US server. Atleast If google books is still being used and uses IP address to return book data based on region
```bash
EXPO_PUBLIC_CPU_US_API_URL=https://examplecpu.com
EXPO_PUBLIC_GPU_API_URL=https://examplegpu.com
```

1. Install dependencies

```bash
   npm install
```

2. start the app with tunnel to see on phone 👀

```bash
    npx expo start --tunnel
```
   - to run app in android studio, make sure some project is open in android studio and the emulator in there (device) is running
   - when project is running with: npx expo start --tunnel
   - press a and android url will pop up and emulator will automatically show app on android studio
   - if the app is not loading you can put the android url in the expo app on the emulator
   - if that does not work, make sure the emulator is connected to the internet (android wifi)

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

If there is any issue with getting values from .env, use 
`NODE_ENV=test npx expo start --tunnel`
so that it can read the env file in the first place.

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
