const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());

const compiledFactory = require('../ethereum/build/Factory.json');
const compiledProject = require('../ethereum/build/ProjectInstance.json');
const compiledProfile = require('../ethereum/build/ProfileInstance.json');

let accounts;
let factory;
let projectAddress;
let project;
let profileAddress;
let profile;

beforeEach(async () => {
    accounts = await web3.eth.getAccounts();

    factory = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
        .deploy({ data: compiledFactory.bytecode })
        .send({ from: accounts[0], gas: '3000000' });

    await factory.methods.createProject('startup3000', 'Webdeveloper (m/w)', '45621', 'desc', '200')
        .send({ from: accounts[0], gas: '3000000' });

    const projectAddresses = await factory.methods.getDeployedProjects().call();
    projectAddress = projectAddresses[0];

    project = await new web3.eth.Contract(JSON.parse(compiledProject.interface), projectAddress);

    await factory.methods.createProfile('Sven', 'Motschnig', '123123', 'Education', 'Experience', 'Skills')
        .send({ from: accounts[0], gas: '3000000' });

    const profileAddresses = await factory.methods.getDeployedProfiles().call();
    profileAddress = profileAddresses[0];

    profile = await new web3.eth.Contract(JSON.parse(compiledProfile.interface), profileAddress);
});

describe('Projects', () => {
    it('deploys a factory, a project and a profile', () => {
        assert.ok(factory.options.address);
        assert.ok(project.options.address);
        assert.ok(profile.options.address);
    });

    it('marks caller as the project manager / as the profile manager', async () => {
        const projectManager = await project.methods.manager().call();
        assert.equal(accounts[0], projectManager);

        const profileManager = await profile.methods.manager().call();
        assert.equal(accounts[0], profileManager);
    });

    it('calls the getter-/setter-function of profile', async () => {
        await profile.methods.setInstructor('Sascha', 'Motschnig', '22', 'Education', 'Experience', 'Skills')
            .send({ from: accounts[0], gas: '3000000' });
        const showUserProfile = await profile.methods.getInstructor().call();
        console.log(showUserProfile);
    });

    it('calls the datetime when profile was created as uint', async () => {
        console.log(await profile.methods.date().call());
    });
});
