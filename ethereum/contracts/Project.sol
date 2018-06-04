pragma solidity ^0.4.2;

contract ProjectFactory {
    address[] public deployedProjects; 
    
    function createProject(uint minimum) public {
        address newProject = new Project(minimum, msg.sender);
        deployedProjects.push(newProject);
    }
    
    function getDeployedProjects() public view returns (address[]) {
        return deployedProjects;
    }
}

contract Project {
    
    string fName;
    uint age;
    address owner;
    
    uint public minimumContribution;
    
    function Project(uint minimum, address creator) public {
        owner = creator;
        minimumContribution = minimum;
    }
    
    modifier onlyOwner {
        require(msg.sender == owner);
        _;
    }
    
    event Instructor (
        string name,
        uint age
    );
    
    function setInstructor(string _fName, uint _age) onlyOwner public {
        fName = _fName;
        age = _age;
        emit Instructor(_fName, _age);
    }
    
    function getInstructor() public constant returns(string, uint) {
        return (fName, age);
    }
    
}

contract Freelancer {
    string lName;
    uint age;
}