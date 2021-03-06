pragma solidity ^0.4.2;

contract Factory {
    address[] private deployedProjects;
    address[] private deployedProfiles;

    /* lists the struct infos oft the initialized project */
    mapping(address => ProjectInitializer) public projects;
    
    /* lists if someone has already created a profile */
    mapping(address => bool) public profileAlreadyExists;
   
    /* lists the profile address of the profile manager */
    mapping(address => address) public profileDeployedAddress;
    
    /* don't repeat yourself - no better solution found yet */
    struct ProjectInitializer {
        string startup;
        string title;
        uint wage;
        uint date;
        address manager;
    }

    /* creates new project by calling the constructor and also adds the same data to the initializer for the landing page */
    function createProject(string _startup, string _title, string _deadline, string _description) public payable {
        address newProject = (new ProjectInstance).value(msg.value)(_startup, _title, _deadline, _description, now, msg.sender);

        ProjectInitializer memory newProjectInitializer = ProjectInitializer({
            startup: _startup,
            title: _title,
            wage: msg.value,
            date: now,
            manager: msg.sender
        });

        projects[newProject] = newProjectInitializer;
        deployedProjects.push(newProject);
    }
    
    /* returns all deployed projects as an array */
    function getDeployedProjects() public view returns (address[]) {
        return deployedProjects;
    }
    
    /* gets all projects to list on the landing page */
    function getProjects(address _address) view public returns(string startup, string title, uint wage, uint date, address manager) {
        return (
            projects[_address].startup,
            projects[_address].title,
            projects[_address].wage,
            projects[_address].date,
            projects[_address].manager
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
    uint public requesterCount;
    Project public project;

    address[] public requesterList;
    mapping(address => Requester) private requests;

    struct Project {
        string startup;
        string title;
        string deadline;
        string description;
        uint date;
        bool finalizedByFreelancer;
        bool finalizedByStartup;
        bool isFinished;
        mapping(address => bool) requests;
        address chosenFreelancer;
        bool underInvestigation;
    }
    
    struct Requester {
        bool hasBeenChosen;
        string email;
        string info;
        address _address;
    }
    
    modifier restricted() {
        require(msg.sender == manager);
        _;
    }

    constructor(string _startup, string _title, string _deadline, string _description, uint _date, address _manager) public payable {
        manager = _manager;
        Project memory newProject = Project({
            startup: _startup,
            title: _title,
            deadline: _deadline,
            description: _description,
            date: _date,
            finalizedByFreelancer: false,
            finalizedByStartup: false,
            isFinished: false,
            chosenFreelancer: 0,
            underInvestigation: false
        });
        project = newProject;
    }
    
    /* returns all information about the project */
    function getSummary() view public returns(string, string, string, string, uint, bool, uint, address, address, bool) {
        return (
            project.startup,
            project.title,
            project.deadline,
            project.description,
            project.date,
            project.isFinished,
            address(this).balance,
            project.chosenFreelancer,
            manager,
            project.underInvestigation
        );
    }

    /* returns all information about the project */
    function getApplicantInfo(address _address) view public returns(string, string, bool) {
        return (
            requests[_address].email,
            requests[_address].info,
            requests[_address].hasBeenChosen
        );
    }
    
    /* allows freelancer to apply to project */
    function setRequest(string _email, string _info) public {
        Project storage storedProject = project;
        
        require(manager != msg.sender);
        require(!requester[msg.sender]);
        require(!storedProject.finalizedByFreelancer);
        require(!storedProject.finalizedByStartup);
        
        requester[msg.sender] = true;
        storedProject.requests[msg.sender] = true;
        requesterCount++;
        
        requesterList.push(msg.sender);
    
        Requester memory newRequest = Requester({
           hasBeenChosen: false,
           email: _email,
           info: _info,
           _address: msg.sender
        });
        
        requests[msg.sender] = newRequest;
    }
    
    /* startup or freelancer can set project to under investigation */
    function callInvestigator() public {
        require(msg.sender == manager || msg.sender == project.chosenFreelancer);
        require(!project.isFinished);
        require(project.chosenFreelancer != 0);
        project.underInvestigation = true;
    }
    
    /* startup can cancel project and gets wage back */
    function cancelProject() public restricted {
        project.isFinished = true;
        require(!project.underInvestigation);
        require(!project.underInvestigation);
        manager.transfer(address(this).balance);
    }
    
    /* allows startup to choose a freelancer out of the applicant list for the project */
    function chooseRequester(address _address) public restricted {
        Requester storage requesterByAddress = requests[_address];
        require(!requesterByAddress.hasBeenChosen);
        requesterByAddress.hasBeenChosen = true;
        project.chosenFreelancer = _address;
    }
        
    /* returns the requester (freelancer) list as an array */
    function getRequesterList() public view returns (address[]) {
        return requesterList;
    }
    
    /* allows freelancer to finalize the open project */
    function finalizeProjectAsFreelancer(address _address, uint _rating) public {
        /* creates a temporary profile class with the address of the startup-manager */
        ProfileInstance profileInstance;
        profileInstance = ProfileInstance(_address);
        
        require(!project.underInvestigation);
        
        Requester storage requesterByAddress = requests[msg.sender];
        require(requesterByAddress.hasBeenChosen);
        
        Project storage storedProject = project;
        require(!storedProject.finalizedByFreelancer);
        
        profileInstance.setRating(_rating);
        
        storedProject.finalizedByFreelancer = true;
    }
    
    /* allows startup to finalize the open project */
    function finalizeProjectAsStartup(address _address, uint _rating) public restricted {
        /* creates a temporary profile class with the address of the freelancer */
        ProfileInstance profileInstance;
        profileInstance = ProfileInstance(_address);
        
        require(!project.underInvestigation);

        Project storage storedProject = project;
        require(storedProject.finalizedByFreelancer);
        require(!storedProject.finalizedByStartup);
        
        profileInstance.setRating(_rating);
        
        storedProject.finalizedByStartup = true;
        project.isFinished = true;
        project.chosenFreelancer.transfer(address(this).balance);
    }
}

contract ProfileInstance {
    address public manager;
    uint public rating;
    uint public ratingsCounter;
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
    
    /* allows user to change or/and to update profile information */
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
    
    /* sets rating for user evaluation scheme (called in ProjectInstance) */
    function setRating(uint _rating) public {
        require(msg.sender != manager);
                
        rating += _rating;
        ratingsCounter++;
    }
}