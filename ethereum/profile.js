import web3 from './web3';
import Profile from './build/Profile.json';
import address from '../config/address';

const instance = new web3.eth.Contract(
    JSON.parse(Profile.interface),
    address.address
);

export default instance;
