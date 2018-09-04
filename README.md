# StartupsOnTheBlockchain
a blockchain-based startup webplatform

#### How to get started?

* Clone Repository: __`git clone https://github.com/smotschnig/StartupsOnTheBlockchain.git`__
* Open folder: __`cd StartupsOnTheBlockchain`__
* Run: __`npm install`__
* Build: __`npm run build`__
* Start Server by: __`npm run start`__

If you are on a Unix-System you have to change one line in package.json file.
* Change: __`"start": "SET NODE_ENV=production && node server.js"`__ to: __`"start": "NODE_ENV=production node server.js"`__

After that you can visit the webplatform at __`http://localhost:3000`__ or you may change the port in the __`server.js`__ file.
You have to install Metamask connected with a Rinkeby-Account to use the webplatform correctly. 

#### How to compile and deploy own contract?

* Move to folder ethereum: __`cd ethereum`__
* Compile contract: __`node compile.js`__
* Deploy contract: __`node deploy.js`__
* Copy __`Contract depolyed to 0x000000`__ address to the clipboard

* Open the config folder in the root directory: __`cd config`__
* Open following file in this directory: __`address.js`__
* Update address in second line: __`module.exports = { address: '0x000000' (address from clipboard)};`__
  
If there are problems with npm install on Windows, you have to install additional dependencies globally.
* Run: __`npm install --global --production windows-build-tools`__
* Run: __`npm install --global node-gyp`__
