const path = require('path');
const solc = require('solc');
const fs = require('fs-extra');

// deletes entire 'build' folder
const buildPath = path.resolve(__dirname, 'build');
fs.removeSync(buildPath);

// reads 'Project.sol' from the 'contracts' folder
const projectPath = path.resolve(__dirname, 'contracts', 'Project.sol');
const source = fs.readFileSync(projectPath, 'utf8');

// compiles contracts with solidity compiler
const output = solc.compile(source, 1).contracts;

// recreates the 'build' folder
fs.ensureDirSync(buildPath);

// writes output to the 'build' folder
for (let contract in output) {
    fs.outputJsonSync(
        path.resolve(buildPath, contract.replace(':', '') + '.json'),
        output[contract]
    );
}

