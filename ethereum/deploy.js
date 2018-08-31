const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const compiledFactory = require('./build/Factory.json');

const provider = new HDWalletProvider(
    'machine such viable circle gain quick under apology kind surge finish upgrade',
    'https://rinkeby.infura.io/3gyFqy8jpggJCVKhMsAU'
);

const web3 = new Web3(provider);

const deploy = async () => {
    const accounts = await web3.eth.getAccounts();
    console.log('Attempting to deploy from account', accounts[0]);

    const result = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
        .deploy({ data: '0x' + compiledFactory.bytecode })
        .send({ gas: '4000000', from: accounts[0] });

    console.log('Contract deployed to', result.options.address);
};

deploy();