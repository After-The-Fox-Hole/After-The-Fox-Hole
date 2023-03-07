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
				<a href="#" class="card-link">Link to post/event page</a>
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

let typeSelect = document.getElementById("type");
typeSelect.addEventListener("change", function() {
    let selectedValue = typeSelect.value;

    if (selectedValue === "post"){
        //get call for posts
    } else if (selectedValue === "event"){
        //get call for events
    } else if (selectedValue === "all"){
        //get call for all
    };
    console.log("Selected value: " + selectedValue);
    //clearing the value to run again
});

let fireTab = document.getElementById("fireteamTab")
fireTab.addEventListener("click", function() {
    displayFireteamCards(user.fireteam.posts)
});

let scoutTab = document.getElementById("scoutingTab")
scoutTab.addEventListener("click", function() {
    displayScoutingCards(all.posts) //???
});