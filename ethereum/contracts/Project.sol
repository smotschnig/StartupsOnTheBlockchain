pragma solidity ^0.4.2;

contract ProjectFactory {
    address[] public deployedProjects;
    mapping(address => string) public projectStartup;
    mapping(address => string) public projectTitle;
    mapping(address => uint) public projectDate;

    function createProject(string startup, string title, string deadline, string description, uint wage, uint date) public {
        address newProject = new Project(startup, title, deadline, description, wage, now, msg.sender);
        projectStartup[newProject] = startup;
        projectTitle[newProject] = title;
        projectDate[newProject] = now;
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
    string public startup;
    string public title;
    string public deadline;
    string public description;
    uint public wage;
    uint public date;

    modifier restricted() {
        require(msg.sender == manager);
        _;
    }

    constructor(string _startup, string _title, string _deadline, string _description, uint _wage, uint _date, address _creator) public {
        manager = _creator;
        startup = _startup;
        title = _title;
        deadline = _deadline;
        description = _description;
        wage = _wage;
        date = _date;
    }

    function getSummary() public view returns (string, string, string, string, uint, uint, address) {
        return (
            startup,
            title,
            deadline,
            description,
            wage,
            date,
            manager
        );
    }

}

contract Owned {
    address owner;
    
    constructor() public {
        owner = msg.sender;
    }
    
    modifier onlyOwner {
        require(msg.sender == owner);
        _;
    }
}

contract Profile is Owned {
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
    
    function setInstructor(address _address, uint _age, string _fName, string _lName, string _training) onlyOwner public {
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
    
    function getInstructor(address _address) public view returns(uint, string, string, string) {
        return (
            instructors[_address].age, 
            instructors[_address].fName, 
            instructors[_address].lName, 
            instructors[_address].training
        );
    }
    
    function countInstructors() view public returns (uint) {
        return instructorAccounts.length;
    }
}