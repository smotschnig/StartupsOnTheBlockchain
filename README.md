# StartupsOnTheBlockchain
a blockchain-based startup webplatform

#### How to get started?

* Clone Repository: __`git clone https://github.com/smotschnig/StartupsOnTheBlockchain.git`__
* Open folder: __`cd StartupsOnTheBlockchain`__
* Run: __`npm install`__
* Start Server by: __`npm run dev`__

After that you can visit the webplatform at __`http://localhost:3000`__ or you may change the port in the __`server.js`__ file.
You have to install Metamask connected with a Rinkeby-Account to use the webplatform correctly. 

#### How to compile and deploy own contract?

* Move to folder ethereum: __`cd ethereum`__
* Open file: __`node compile.js`__
* Deploy Contract: __`node deploy.js`__
* Copy __`Contract depolyed to 0x000000`__ address to the clipboard

* Open the config folder in the root directory: __`cd config`__
* Open address file in this directory: __`address.js`__
* Update address line: __`module.exports = { address: '0x000000' (address from clipboard)};`__
  
If there are problems with npm install on Windows, you have to install additional dependencies globally.
* Run: __`npm install --global --production windows-build-tools`__
* Run: __`npm install --global node-gyp`__
