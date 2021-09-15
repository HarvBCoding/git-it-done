// variables to store a reference to the form 
var userFormEl = document.querySelector("#user-form");
var nameInputEl = document.querySelector("#username");
var repoContainerEl = document.querySelector("#repos-container");
var repoSearchTerm = document.querySelector("#repo-search-term");


var formSubmitHandler = function(event) {
    event.preventDefault();
    // get value from input element via the nameInputEl DOM variable and store it in its own variable
    var username = nameInputEl.value.trim();

    // if username variable has a value, that value will be passed to getUserRepos() as an argument
    if (username) {
        getUserRepos(username);
        nameInputEl.value = "";
    } else {
        alert("Please enter a Github username");
    }
    console.log(event);
};

var getUserRepos = function(user) {
    // format the github api url
    var apiUrl = "https://api.github.com/users/" + user + "/repos";

    // make a request to the url from github
    fetch(apiUrl).then(function(response) {
        // check if the request was succesful by using the ok propery; if the ok property is false user will receive an alert
        if (response.ok) {
            response.json().then(function(data) {
                displayRepos(data, user);
            });
        } else {
            alert("Error: GitHub User Not Found");
        }
    })
    .catch(function(error) {
        // catch() method is the fetch API's way of handling network errors
        alert("Unable to connect to GitHub");
    });
};

// function will accept both the array of repository data and the term we searched for as parameters
var displayRepos = function(repos, searchTerm) {

    // check if api returned any repos
    if (repos.length === 0) {
        repoContainerEl.textContent = "No repositories found.";
        return;
    }

    repoSearchTerm.textContent = searchTerm;

    // loop over repos; in the for loop we take each repo(repos[i]) and write some of its data to the page
    for(var i = 0; i < repos.length; i++) {
        // format repo name
        var repoName = repos[i].owner.login + "/" + repos[i].name;

        // create a container for each repo
        var repoEl = document.createElement("div");
        repoEl.classList = "list-item flex-row justify-space-between align-center";

        // create span element to hold repository name
        var titleEl = document.createElement("span");
        titleEl.textContent = repoName;

        // append to container
        repoEl.appendChild(titleEl);

        // create a status elemenmt
        var statusEl = document.createElement("span");
        statusEl.classList = "flex-row align-center";

        // check if current repo has issues or not; if the number of issues is greater than zero add a red X icon, if there are no issues, display a blue check mark
        if (repos[i].open_issues_count > 0) {
            statusEl.innerHTML = 
            "<i class='fas fa-times status-icon icon-danger'></i>" + repos[i].open_issues_count + " issue(s)";
        } else {
            statusEl.innerHTML = "<i class='fas fa-check-square status-icon icon-success'></i>";
        }

        // append to container
        repoEl.appendChild(statusEl);

        // append container to the dom
        repoContainerEl.appendChild(repoEl);
    }
};

userFormEl.addEventListener("submit", formSubmitHandler);