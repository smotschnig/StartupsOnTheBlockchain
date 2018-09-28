pragma solidity ^0.4.2;

contract Factory {
    address[] private deployedProjects;
    address[] private deployedProfiles;
   
    /* lists if someone has already created a profile */
    mapping(address => bool) public profileAlreadyExists;
   
    /* lists the profile address of the profile manager */
    mapping(address => address) public profileDeployedAddress;

    /* creates new project by calling the constructor and also adds the same data to the initializer for the landing page */
    function createProject(string _startup, string _title, string _deadline, string _description) public payable {
        address newProject = (new ProjectInstance).value(msg.value)(_startup, _title, _deadline, _description, now, msg.sender);
        deployedProjects.push(newProject);
    }
    
    /* returns all deployed projects as an array */
    function getDeployedProjects() public view returns (address[]) {
        return deployedProjects;
    }

    /* creates new profile for new user */
    function createProfile(string _fName, string _lName, string _birthDate, string _education, string _experience) public {
        require(profileAlreadyExists[msg.sender] == false); 
        address newProfile = new ProfileInstance(_fName, _lName, _birthDate, _education, _experience, msg.sender);
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
    
    bool public finalizedByFreelancer = false;
    bool public finalizedByStartup = false;
    bool public isFinished = false;
    bool public isOpen = true;
    bool public underInvestigation = false;


    struct Project {
        string startup;
        string title;
        string deadline;
        string description;
        uint date;
        mapping(address => bool) requests;
        address chosenFreelancer;
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
            chosenFreelancer: 0
        });
        project = newProject;
    }
    
    /* returns all information about the project */
    function getSummary() view public returns(string, string, string, string, uint, uint, address, address) {
        return (
            project.startup,
            project.title,
            project.deadline,
            project.description,
            project.date,
            address(this).balance,
            project.chosenFreelancer,
            manager
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
        require(!finalizedByFreelancer);
        require(!finalizedByStartup);
        
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
        require(!isFinished);
        require(!underInvestigation);
        underInvestigation = true;
        isOpen = false;
    }
    
    /* startup can cancel project and gets wage back */
    function cancelProject() public restricted {
        isFinished = true;
        require(!underInvestigation);
        require(isOpen);
        manager.transfer(address(this).balance);
        isOpen = false;
    }
    
    /* allows startup to choose a freelancer out of the applicant list for the project */
    function chooseRequester(address _address) public restricted {
        Requester storage requesterByAddress = requests[_address];
        require(!requesterByAddress.hasBeenChosen);
        require(isOpen);
        requesterByAddress.hasBeenChosen = true;
        project.chosenFreelancer = _address;
        isOpen = false;
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
        
        require(!isOpen);
        require(!underInvestigation);
        
        Requester storage requesterByAddress = requests[msg.sender];
        require(requesterByAddress.hasBeenChosen);
        
        require(!finalizedByFreelancer);

        profileInstance.setRating(_rating);
        
        finalizedByFreelancer = true;
        isOpen = false;
    }
    
    /* allows startup to finalize the open project */
    function finalizeProjectAsStartup(address _address, uint _rating) public restricted {
        /* creates a temporary profile class with the address of the freelancer */
        ProfileInstance profileInstance;
        profileInstance = ProfileInstance(_address);
        
        require(!isOpen);
        require(!underInvestigation);

        require(finalizedByFreelancer);
        require(!finalizedByStartup);
        
        profileInstance.setRating(_rating);
        
        finalizedByStartup = true;
        isFinished = true;
        isOpen = false;
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
    }
    
    modifier restricted {
        require(msg.sender == manager);
        _;
    }
    
    constructor(string _fName, string _lName, string _birthDate, string _education, string _experience, address _manager) public {
        manager = _manager;
        date = now;
        
        ProfileInstructor memory newProfileInstructor = ProfileInstructor({
            fName: _fName, 
            lName: _lName, 
            birthDate: _birthDate,
            education: _education, 
            experience: _experience 
        });
        profile = newProfileInstructor;
    }
    
    /* allows user to change or/and to update profile information */
    function setInstructor(string _fName, string _lName, string _birthDate, string _education, string _experience) restricted public {
        ProfileInstructor memory newProfileInstructor = ProfileInstructor({
            fName: _fName, 
            lName: _lName, 
            birthDate: _birthDate, 
            education: _education, 
            experience: _experience
        });
        profile = newProfileInstructor;
    }
    
    /* returns all information about the user profile */
    function getInstructor() view public returns(string, string, string, string, string) {
        return (
            profile.fName,
            profile.lName,
            profile.birthDate,
            profile.education,
            profile.experience
        );
    }
    
    /* sets rating for user evaluation scheme (called in ProjectInstance) */
    function setRating(uint _rating) public {
        require(msg.sender != manager);
                
        rating += _rating;
        ratingsCounter++;
    }
}