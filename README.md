## Introduction 

Rahat Vendor app is a wallet-based mobile app for the vendors of Rahat. It is used by the vendors, who provides aid material to beneficiaries in exchange of token, to receive and redeem token. 

## Getting Started 

This is a mobile application/wallet that directly interacts with Ethereum blockchain to send transactions. The mobile-app is designed to work on following environments
- Node --version >= 12
- Yarn --version == 1.22.17
- MongoDB --version >= 4.2.8 
- Android Studio 
- Andriod Sdk

### Base Dependencies 
- Networking : axios  
- Navigation library : react-natvigation 
- Device storage : @react-native-async-storage/async-storage 
- State management : redux
- Dispatch asynchronous actions :  redux-thunk

## Prerequisite
To run this software on your machine locally you need to run the following:

- [Rahat Server](https://github.com/esatya/rahat)
- Ganache

## Instalation
1. Clone the repository <br>
`git clone https://github.com/esatya/rahat-vendor-app.git`<br>
`cd rahat-vendor-app`
2. Install nm dependencies <br>
 `npm install ` or `yarn install`
 3. Run the app <br>
 `npx react-native run-android`
 
# Coding Styles
This repository uses eslint to enforce air-bnb coding styles.

# Contributing
Everyone is very welcome to contribute on the codebase of Rahat. Please reach us in Gitter in case of any query/feedback/suggestion.

For more information on the contributing procedure, see [Contribution](https://github.com/esatya/rahat-vendor-app/blob/master/CONTRIBUTING.md).
