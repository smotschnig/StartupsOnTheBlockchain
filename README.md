# StartupOnTheChain
a blockchain-based startup webplatform

#### How to get started?

* Clone Repository: __`git clone https://github.com/smotschnig/StartupOnTheChain.git`__
* Open folder: __`cd StartupOnTheChain`__
* Run: __`npm install`__

* Move to folder ethereum: __`cd ethereum`__
* Compile Contract: __`node compile.js`__
* Deploy Contract: __`node deploy.js`__
* Copy __`Contract depoloyed to 0x000000`__ address to the clipboard

* Create new folder in the root directory: __`mkdir config`__
* Add new file in this directory: __`address.js`__
* Write lines:
  module.exports = {
    address: '0x000000 (address from clipboard)'
  };
  
* Start Server by __`npm run start`__

After that you can visit the Webapp with your Browser at __`http://localhost:3000`__ or you may change the Port in the __`server.js`__ File.
You have to install Metamask connected with a Rinkeby-Account to use the Webapp correctly. 

If there are problems with npm install on Windows, you have to install additional Dependencies globally.
* Run: __`npm install --global --production windows-build-tools`__
* Run: __`npm install --global node-gyp`__
