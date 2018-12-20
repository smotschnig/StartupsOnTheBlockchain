import Web3 from 'web3';

let web3;

if (typeof window !== 'undefined' && typeof window.web3 !== 'undefined') {
    // We are in the browser and metamask is running
    web3 = new Web3(window.web3.currentProvider);
} else {
    // We are on the server or the user is not running metamask
    const provider = new Web3.providers.HttpProvider(
        'https://rinkeby.infura.io/v3/37ae9cd56f074c0190242deb63605e61'
    );
    web3 = new Web3(provider);
}

export default web3;


/** 
 * 20/12/2018 - sm
 * Notice: Since November 2018 MetaMask introduced "Privay Mode" 
 * Maybe you need the following code instead of the code above in the Future!
 * -- If you don't have MetaMask, an error will occure (e.g. Microsoft Edge)--
 */

// import Web3 from 'web3';

// let web3;

// if (typeof window !== 'undefined') {
//     if (typeof window.ethereum !== 'undefined') {
//         web3 = new Web3(ethereum);
//         try {
//             ethereum.enable();
//         } catch (error) {
//             console.log(error);
//         }
//     } else if (typeof window.web3 !== 'undefined') {
//         // We are in the browser and metamask is running
//         web3 = new Web3(window.web3.currentProvider);
//     }
// } else {
//     // We are on the server or the user is not running metamask
//     const provider = new Web3.providers.HttpProvider(
//         'https://rinkeby.infura.io/v3/37ae9cd56f074c0190242deb63605e61'
//     );
//     web3 = new Web3(provider);
// }

// export default web3;