pragma solidity ^0.4.2;

contract ProjectFactory {
    address[] public deployedProjects;
    mapping(address => string) public projectTitle;
    
    function createProject(string startup, string title, string deadline, string description, uint wage) public {
        address newProject = new Project(startup, title, deadline, description, wage, msg.sender);
        projectTitle[newProject] = title;
        deployedProjects.push(newProject);
    }
    
    function getDeployedProjects() public view returns (address[]) {
        return (
            deployedProjects
        );
    }
}
 
contract Project {
    address public manager;
    string public pStartup;
    string public pTitle;
    string public pDeadline;
    string public pDescription;
    uint public pWage;

    modifier restricted() {
        require(msg.sender == manager);
        _;
    }

    constructor(string startup, string title, string deadline, string description, uint wage, address creator) public {
        manager = creator;
        pStartup = startup;
        pTitle = title;
        pDeadline = deadline;
        pDescription = description;
        pWage = wage;
    }

    function getSummary() public view returns (string, string, string, string, uint, address) {
        return (
            pStartup,
            pTitle,
            pDeadline,
            pDescription,
            pWage,
            manager
        );
    }

}

contract Profile {
    struct Instructor {
        uint age;
        string fName;
        string lName;
        string training;
    }
    
    mapping (address => Instructor) instructors;
    address[] public instructorAccounts;

    event instructorInfo(
        string fName,
        string lName,
        uint age,
        string training
    ); 
    
    function setInstructor(address _address, uint _age, string _fName, string _lName, string _training) public {
        var instructor = instructors[_address];
        
        instructor.age = _age;
        instructor.fName = _fName;
        instructor.lName = _lName;
        instructor.training = _training;
        
        instructorAccounts.push(_address) - 1;
        emit instructorInfo(_fName, _lName, _age, _training);
    }
    
    function getInstructors() view public returns(address[]) {
        return instructorAccounts;
    }
    
    function getInstructor(address _address) view public returns(uint, string, string, string) {
        return (instructors[_address].age, instructors[_address].fName, instructors[_address].lName, instructors[_address].training);
    }
    
    function countInstructors() view public returns (uint) {
        return instructorAccounts.length;
    }
}