

document.addEventListener("DOMContentLoaded", function(event) {
    updateTags()
});

 async function updateTags(){
    let tags;
    try{
       tags = await fetch(`/tags`)
        tags = await tags.json();
        
    }
    catch (e) {
        console.error(e);
    }
    
     let postTags = tags.filter(function(tag) { return tag.type === "post"; });
     let eventTags = tags.filter(function(tag) { return tag.type === "event"; });
     let bothTags = tags.filter(function(tag) { return (tag.type === "post" && tag.type === "event"); });
     console.log(postTags)
     let typeVal = document.getElementById("type").value;
     let tagsSelector = document.getElementById("tags");
     tagsSelector.innerHTML = ""
     if (typeVal === "all"){
         for(let i=0; i<bothTags.length; i++) {
             tagsSelector.innerHTML += `<option value=${bothTags[i].content}>${bothTags[i].content}</option>`
         }
     }
     if (typeVal === "post"){
         for(let i=0; i<postTags.length; i++) {
                 tagsSelector.innerHTML += `<option value=${postTags[i].content} >${postTags[i].content}</option>`
             }
         }
     if (typeVal === "event"){
         for(let i=0; i<eventTags.length; i++) {
             tagsSelector.innerHTML += `<option value=${eventTags[i].content}>${eventTags[i].content}</option>`
         }
     }
 }






function displayCards(cards) {
    let whichTab = document.querySelector(".nav-tabs .active").getAttribute("href").substring(1);
    let contentCards = document.getElementById(whichTab);
    contentCards.innerHTML = "";
    cards.forEach(function(cd) {
        contentCards.innerHTML += `<div class="card" style="width: 18rem;">
			<div class="card-body">
				<h5 class="card-title">${cd.title}</h5>
				<h6 class="card-subtitle mb-2 text-muted">${cd.owner.name}</h6>
				<p class="card-text">${cd.content}</p>
				<p class="card-text">${cd.timeCreated}</p>
			</div>
		</div>`;
    });
};

let feedResults = document.querySelectorAll(".feedControl");
feedResults.forEach(function(feed) {
    feed.addEventListener("change", function() {
        let searchText;
        let selectedTags;
        let selectedType = document.getElementById("type").value;
        let selectedSort = document.getElementById("sort").value;
        let selectedTab = document.querySelector(".nav-tabs .active").getAttribute("href");

        fetch(`/homepage/info?typeP=${selectedType}&tabP=${selectedTab}&sortP=${selectedSort}&textP=${searchText}&tagsP=${selectedTags}`)
            .then(response => response.json())
            .then(data => {
                console.log(data);
                displayCards(data);
                //updateTags(data);
            })
            .catch(error => {
                console.error(error);
            });
        
        console.log("Input field changed");
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
