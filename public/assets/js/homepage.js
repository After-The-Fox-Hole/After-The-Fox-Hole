
let selectedType = document.getElementById("type").value;
let selectedTab = document.querySelector(".nav-tabs .active").getAttribute("href");

function displayFireteamCards(cards) {
    let contentCards = document.getElementById("fireteamCards");
    contentCards.innerHTML = "";
    cards.forEach(function(cd) {
        contentCards.innerHTML += `<div class="card" style="width: 18rem;">
			<div class="card-body">
				<h5 class="card-title">${cd.title}</h5>
				<h6 class="card-subtitle mb-2 text-muted">${cd.owner}</h6>
				<p class="card-text">${cd.content}</p>
				<p class="card-text">${cd.timeCreated}</p>
			</div>
		</div>`;
    });
};

function displayScoutingCards(cards) {
    let contentCards = document.getElementById("scoutingCards");
    contentCards.innerHTML = "";
    cards.forEach(function(cd) {
        contentCards.innerHTML += `<div class="card" style="width: 18rem;">
			<div class="card-body">
				<h5 class="card-title">${cd.title}</h5>
				<h6 class="card-subtitle mb-2 text-muted">${cd.owner}</h6>
				<p class="card-text">${cd.content}</p>
				<p class="card-text">${cd.timeCreated}</p>
				<a href="#" class="card-link">Link to post/event page</a>
			</div>
		</div>`;
    });
};

//listener for type filter
let typeSelect = document.getElementById("type");
typeSelect.addEventListener("change", function() {
    let selectedValue = typeSelect.value;

    if (selectedValue === "post"){
        fetch(`/homepage?type=post&tab=${selectedTab}`)
            .then(response => response.json())
            .then(data => {
                console.log(data);
                if(selectedTab === "#fireteam"){
                    displayFireteamCards(data);
                } else if (selectedTab === "#scouting"){
                    displayScoutingCards(data);
                }
            })
            .catch(error => {
                console.error(error);
            });
    } else if (selectedValue === "event"){
        fetch(`/homepage?type=event&tab=${selectedTab}`)
            .then(response => response.json())
            .then(data => {
                console.log(data);
                if(selectedTab === "#fireteam"){
                    displayFireteamCards(data);
                } else if (selectedTab === "#scouting"){
                    displayScoutingCards(data);
                }
            })
            .catch(error => {
                console.error(error);
            });
    } else if (selectedValue === "all"){
        fetch(`/homepage?type=all&tab=${selectedTab}`)
            .then(response => response.json())
            .then(data => {
                console.log(data);
                if(selectedTab === "#fireteam"){
                    displayFireteamCards(data);
                } else if (selectedTab === "#scouting"){
                    displayScoutingCards(data);
                }
            })
            .catch(error => {
                console.error(error);
            });
    };
    console.log("Selected value: " + selectedValue);
    //clearing the value to run again
});

//listener for sort
let sortSelect = document.getElementById("sort");
sortSelect.addEventListener("change", function() {
    let selectedValue = sortSelect.value;
    if (selectedValue === "newFirst") {
        fetch(`/homepage?type=${selectedType}&tab=${selectedTab}&sort=newFirst`)
            .then(response => response.json())
            .then(data => {
                console.log(data);
                if (selectedTab === "#fireteam") {
                    displayFireteamCards(data);
                } else if (selectedTab === "#scouting") {
                    displayScoutingCards(data);
                }
            })
            .catch(error => {
                console.error(error);
            });
    } else if (selectedValue === "newActivity") {
        fetch(`/homepage?type=${selectedType}&tab=${selectedTab}&sort=newActivity`)
            .then(response => response.json())
            .then(data => {
                console.log(data);
                if (selectedTab === "#fireteam") {
                    displayFireteamCards(data);
                } else if (selectedTab === "#scouting") {
                    displayScoutingCards(data);
                }
            })
            .catch(error => {
                console.error(error);
            });
    } else if (selectedValue === "mostComments") {
        fetch(`/homepage?type=${selectedType}&tab=${selectedTab}&sort=mostComments`)
            .then(response => response.json())
            .then(data => {
                console.log(data);
                if (selectedTab === "#fireteam") {
                    displayFireteamCards(data);
                } else if (selectedTab === "#scouting") {
                    displayScoutingCards(data);
                }
            })
            .catch(error => {
                console.error(error);
            });
    } else if (selectedValue === "mostUpvotes") {
        fetch(`/homepage?type=${selectedType}&tab=${selectedTab}&sort=mostUpvotes`)
            .then(response => response.json())
            .then(data => {
                console.log(data);
                if (selectedTab === "#fireteam") {
                    displayFireteamCards(data);
                } else if (selectedTab === "#scouting") {
                    displayScoutingCards(data);
                }
            })
            .catch(error => {
                console.error(error);
            });
    }
});


let fireTab = document.getElementById("fireteamTab")
fireTab.addEventListener("click", function() {
    fetch(`/homepage?type=${selectedType}&tab=${selectedTab}`)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            displayFireteamCards(data);
        })
        .catch(error => {
            console.error(error);
        });
});

let scoutTab = document.getElementById("scoutingTab")
scoutTab.addEventListener("click", function() {
    fetch(`/homepage?type=${selectedType}&tab=${selectedTab}`)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            displayScoutingCards(data);
        })
        .catch(error => {
            console.error(error);
        });
});


//building the fetch

// fetch(`/homepage?type=${selectedType}&tab=${selectedTab}`)
//     .then(response => response.json())
//     .then(data => {
//         // Process the data returned from the server
//         console.log(data);
//         // Call the displayCards function to display the posts
//         displayFireteamCards(data);
//     })
//     .catch(error => {
//         console.error(error);
//         // Handle the error as needed
//     });