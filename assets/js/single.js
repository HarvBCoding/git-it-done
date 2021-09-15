var issueContainerEl = document.querySelector("#issues-container");
var limitWarningEl = document.querySelector("#limit-warning");
var repoNameEl = document.querySelector("#repo-name");

var getRepoIssues = function(repo) {

    // create a variable to hold the query
    var apiUrl = "https://api.github.com/repos/" + repo + "/issues?direction=asc";
    fetch(apiUrl)
    .then(function(response) {
        // request was successful
        if (response.ok) {
            response.json()
            .then(function(data) {
                // pass response data to dom function
                displayIssues(data);

                // check if api has paginated issues
                if (response.headers.get("Link")) {
                    displayWarning(repo);
                }
            });
        } else {
            // if not successful, redirect to homepage
            document.location.replace("./index.html");
        }
    });
};

var getRepoName = function() {
    // the location object contains many methods and properties that hold information about thr url of the webpage, the search property is chosen b/c it contains the query string (when in doubt log the object to see what value you need to target)
    var queryString = document.location.search;
    // the split method is used to split strings; to get the repo name we take the url and split it at the = sign to get the repo name
    var repoName = queryString.split("=")[1];

    // if there's a value for repoName
    if (repoName) {
        // display the name of the repo in the element
        repoNameEl.textContent = repoName;
        // the repoName is then passed to the getRepoIssues function as a parameter which will then use the repoName to fetch the related issued from github
        getRepoIssues(repoName);
    } else {
        // if no repo was given redirect to the homepage
        document.location.replace("./index.html");
    }
};

var displayIssues = function(issues) {

    // check if there are no issues and display the appropriate message
    if (issues.length === 0) {
        issueContainerEl.textContent = "This repo has no open issues!";
        return;
    }

    for (var i = 0; i < issues.length; i++) {
        // create a link element to take users to the issue on github
        var issueEl = document.createElement("a");
        issueEl.classList = "list-item flex-row justify-space-between align center";
        issueEl.setAttribute("href", issues[i].html_url);
        // the target="_blank" will open the issue link in a new window instead of replacing the current page
        issueEl.setAttribute("target", "_blank");

        // create span to hold issue title
        var titleEl = document.createElement("span");
        titleEl.textContent = issues[i].title;

        // append to container
        issueEl.appendChild(titleEl);

        // create a type element
        var typeEl = document.createElement("span");

        // check if issue is an actual issue or a pull request
        if (issues[i].pull_request) {
            typeEl.textContent = "(Pull request)";
        } else {
            typeEl.textContent = "(Issue)";
        }

        // append to container
        issueEl.appendChild(typeEl);

        issueContainerEl.appendChild(issueEl);
    }
};

var displayWarning = function(repo) {

    // add text to warning container
    limitWarningEl.textContent = "To see more than 30 issues, visit ";
    // append link element with attribute to github
    var linkEl = document.createElement("a");
    linkEl.textContent = "See More Issues on GitHub.com";
    linkEl.setAttribute("href", "https://github.com/" + repo + "/issues");
    linkEl.setAttribute("target", "_blank");

    // append to warning container
    limitWarningEl.appendChild(linkEl);
};

getRepoName();