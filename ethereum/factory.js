import web3 from './web3';
import ProjectFactory from './build/ProjectFactory.json';

const instance = new web3.eth.Contract(
    JSON.parse(ProjectFactory.interface),
    '0xD429C897Bb7Afb3C96334c8749b49e22D8B2B4Fb'
);

export default instance;
