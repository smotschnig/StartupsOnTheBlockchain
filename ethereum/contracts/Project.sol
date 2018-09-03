pragma solidity ^0.4.2;

contract Factory {
    address[] private deployedProjects;
    address[] private deployedProfiles;
    
    /* lists the struct infos oft the initialized project */
    mapping(address => ProjectInitializer) private projects;
    
    /* lists if someone has already created a profile */
    mapping(address => bool) public profileAlreadyExists;
   
    /* lists the profile address of the profile manager */
    mapping(address => address) public profileDeployedAddress;

    /* don't repeat yourself - no better solution found yet */
    struct ProjectInitializer {
        string startup;
        string title;
        uint date;
    }

    /* creates new project by calling the constructor and also adds the same data to the initializer for the landing page */
    function createProject(string _startup, string _title, string _deadline, string _description, uint _wage) public {
        address newProject = new ProjectInstance(_startup, _title, _deadline, _description, _wage, now, msg.sender);
        
        ProjectInitializer memory newProjectInitializer = ProjectInitializer({
           startup: _startup,
           title: _title,
           date: now
        });

        projects[newProject] = newProjectInitializer;
        deployedProjects.push(newProject);
    }
    
    /* returns all deployed projects as an array */
    function getDeployedProjects() public view returns (address[]) {
        return deployedProjects;
    }
    
    /* gets all projects to list on the landing page */
    function getProjects(address _address) view public returns(string startup, string title, uint date) {
        return (
            projects[_address].startup,
            projects[_address].title,
            projects[_address].date
        );
    }
    
    /* creates new profile for new user */
    function createProfile(string _fName, string _lName, string _birthDate, string _education, string _experience, string _skills) public {
        require(profileAlreadyExists[msg.sender] == false);
        address newProfile = new ProfileInstance(_fName, _lName, _birthDate, _education, _experience, _skills, msg.sender);
        deployedProfiles.push(newProfile);
        profileDeployedAddress[msg.sender] = newProfile;
        profileAlreadyExists[msg.sender] = true;
    }
    
    /* return all deployed profiles as an array */
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
    Requester[] public request;

    struct Project {
        string startup;
        string title;
        string deadline;
        string description;
        uint wage;
        uint date;
        bool finalize;
        mapping(address => bool) requests;
    }
    
    struct Requester {
        bool hasBeenChoosen;
        string info;
        string email;
        address _address;
    }
    
    modifier restricted() {
        require(msg.sender == manager);
        _;
    }

    constructor(string _startup, string _title, string _deadline, string _description, uint _wage, uint _date, address _manager) public {
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
    
    /* returns all information about the project */
    function getSummary() view public returns(string, string, string, string, uint, uint, address) {
        return (
            project.startup,
            project.title,
            project.deadline,
            project.description,
            project.wage,
            project.date,
            manager
        );
    }

    /* allows freelancer to apply to project */
    function setRequest(string _email, string _info) public {
        Project storage storedProject = project;
        
        require(msg.sender != manager);
        require(!requester[msg.sender]);
        require(!storedProject.finalize);
        requester[msg.sender] = true;

        storedProject.requests[msg.sender] = true;
        requesterCount++;
        
        requesterList.push(msg.sender);
    
        Requester memory newRequest = Requester({
           hasBeenChoosen: false,
           email: _email,
           info: _info,
           _address: msg.sender
        });
        
        request.push(newRequest);
    }
    
    /* allows startup to choose a freelancer out of the applicant list for the project */
    function chooseRequester(uint _index) public restricted {
        Requester storage requesterByIndex = request[_index];
        require(!requesterByIndex.hasBeenChoosen);
        requesterByIndex.hasBeenChoosen = true;
    }
        
    /* returns the requester (freelancer) list as an array */
    function getRequesterList() public view returns (address[]) {
        return requesterList;
    }
    
    /* allows freelancer to finalize the open project */
    function finalizeProjectAsFreelancer(uint _index) public restricted {
        Requester storage requesterByIndex = request[_index];
        require(!requesterByIndex.hasBeenChoosen);
        
        // Todo: rate startup
        Project storage storedProject = project;
        storedProject.finalize = true;
    }
    
    /* allows startup to finalize the open project */
    function finalizeProjectAsStartup() public restricted {
        // Todo: rate freelancer
        // Todo: send freelancer wage
        
        Project storage storedProject = project;
        storedProject.finalize = true;
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
        string birthDate;
        string education;
        string experience;
        string skills;
    }
    
    modifier restricted {
        require(msg.sender == manager);
        _;
    }
    
    constructor(string _fName, string _lName, string _birthDate, string _education, string _experience, string _skills, address _manager) public {
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
    
    /* allows user to change or/and to update profile informations */
    function setInstructor(string _fName, string _lName, string _birthDate, string _education, string _experience, string _skills) restricted public {
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
    
    /* returns all information about the user profile */
    function getInstructor() view public returns(string, string, string, string, string, string) {
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