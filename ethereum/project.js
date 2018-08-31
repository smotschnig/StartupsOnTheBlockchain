import web3 from './web3';
import Project from './build/ProjectInstance.json';

export default (address) => {
    return new web3.eth.Contract(
        JSON.parse(Project.interface),
        address
    );
};