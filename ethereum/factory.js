import web3 from './web3';
import Factory from './build/Factory.json';
import address from '../config/address';

const instance = new web3.eth.Contract(
    JSON.parse(Factory.interface),
    address.address
);

export default instance;
