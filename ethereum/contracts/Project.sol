pragma solidity ^0.4.2;

contract Factory {
    address[] public deployedProjects;
    address[] public deployedProfiles;
    mapping(address => ProjectInitializer) public projects;

    /* don't repeat yourself - no better solution found yet */
    struct ProjectInitializer {
        string startup;
        string title;
        uint wage;
        uint date;
    }

    /* creates new Project by calling the constructor and also adds the same data to the Initializer for the landing page */
    function createProject(string _startup, string _title, uint _deadline, string _description, uint _wage) public {
        address newProject = new ProjectInstance(_startup, _title, _deadline, _description, _wage, now, msg.sender);
        
        ProjectInitializer memory newProjectInitializer = ProjectInitializer({
           startup: _startup,
           title: _title,
           wage: _wage,
           date: now
        });

        projects[newProject] = newProjectInitializer;
        deployedProjects.push(newProject);
    }
    
    function getDeployedProjects() public view returns (address[]) {
        return deployedProjects;
    }
    
    /* gets all Projects to list on the landing page */
    function getProjects(address _address) view public returns(string, string, uint, uint) {
        return (
            projects[_address].startup,
            projects[_address].title,
            projects[_address].wage,
            projects[_address].date
        );
    }
    
        /* creates new Profile for every new user */
    function createProfile(string _fName, string _lName, uint _birthDate, string _education, string _experience, string _skills) public {
        address newProfile = new ProfileInstance(_fName, _lName, _birthDate, _education, _experience, _skills, msg.sender);
        deployedProfiles.push(newProfile);
    }
    
    function getDeployedProfiles() public view returns (address[]) {
        return (
            deployedProfiles
        );
    }
}

contract ProjectInstance {
    address public manager;
    mapping(address => bool) public requester;
    address[] public requesterList;
    uint public requesterCount;
    Project public project;
    
    struct Project {
        string startup;
        string title;
        uint deadline;
        string description;
        uint wage;
        uint date;
        bool finalize;
        mapping(address => bool) requests;
    }
    
    modifier restricted() {
        require(msg.sender == manager);
        _;
    }

    constructor(string _startup, string _title, uint _deadline, string _description, uint _wage, uint _date, address _manager) public {
        manager = _manager;
        Project memory newProject = Project({
           startup: _startup,
           title: _title,
           deadline: _deadline,
           description: _description,
           wage: _wage,
           date: _date,
           finalize: false
        });
        project = newProject;
    }

    function setRequest() public {
        Project storage storedProject = project;
        
        require(msg.sender != manager);
        require(!requester[msg.sender]);
        requester[msg.sender] = true;

        storedProject.requests[msg.sender] = true;
        requesterCount++;
        
        requesterList.push(msg.sender);
    }
    
    function finalizeProject() public {
        Project storage storedProject = project;
        
        storedProject.finalize = true;
    }
    
    function getRequesterList() public view returns (address[]) {
        return requesterList;
    }
}

contract ProfileInstance {
    address public manager;
    uint public rating;
    uint public date;
    ProfileInstructor private profile;
    
    struct ProfileInstructor {
        string fName;
        string lName;
        uint birthDate;
        string education;
        string experience;
        string skills;
    }
    
    modifier restricted {
        require(msg.sender == manager);
        _;
    }
    
    constructor(string _fName, string _lName, uint _birthDate, string _education, string _experience, string _skills, address _manager) public {
        manager = _manager;
        date = now;
        
        ProfileInstructor memory newProfileInstructor = ProfileInstructor({
            fName: _fName, 
            lName: _lName, 
            birthDate: _birthDate, 
            education: _education, 
            experience: _experience, 
            skills: _skills
        });
        profile = newProfileInstructor;
    }
    
    function setInstructor(string _fName, string _lName, uint _birthDate, string _education, string _experience, string _skills) restricted public {
        ProfileInstructor memory newProfileInstructor = ProfileInstructor({
            fName: _fName, 
            lName: _lName, 
            birthDate: _birthDate, 
            education: _education, 
            experience: _experience, 
            skills: _skills
        });
        profile = newProfileInstructor;
    }
    
    function getInstructor() view public returns(string, string, uint, string, string, string) {
        return (
            profile.fName,
            profile.lName,
            profile.birthDate,
            profile.education,
            profile.experience,
            profile.skills
        );
    }
}