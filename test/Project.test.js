const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());

const compiledFactory = require('../ethereum/build/ProjectFactory.json');
const compiledProject = require('../ethereum/build/Project.json');

let accounts;
let factory;
let projectAddress;
let project;

beforeEach(async () => {
    accounts = await web3.eth.getAccounts();

    factory = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
        .deploy({ data: compiledFactory.bytecode })
        .send({ from: accounts[0], gas: '1000000' });

    // creating a new Project 
    // string startup, string title, string deadline, string description, uint wage
    await factory.methods.createProject('StartupX', 'Webdeveloper', '22.02.2019', 'HTML, CSS, JavaScript', '100').send({
        from: accounts[0],
        gas: '1000000'
    });

    // takes first element out of the array and asigns it to projectAddress
    [projectAddress] = await factory.methods.getDeployedProjects().call();

    project = await new web3.eth.Contract(
        JSON.parse(compiledProject.interface),
        projectAddress
    );
});

describe('Projects', () => {
    it('deploys a factory and a project', () => {
        assert.ok(factory.options.address);
        assert.ok(project.options.address);
    });

    it('marks caller as the project manager', async () => {
        const manager = await project.methods.manager().call();
        assert.equal(accounts[0], manager);
    });

});