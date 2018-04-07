import web3 from './web3';
import ProjectFactory from './build/ProjectFactory.json';
import address from '../config/address';

const instance = new web3.eth.Contract(
    JSON.parse(ProjectFactory.interface),
    address.address
);

export default instance;
