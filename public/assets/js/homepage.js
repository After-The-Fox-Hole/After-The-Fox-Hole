
//grabbing the appropriate tags for what is being displayed on the page and populating the tag selector field
document.addEventListener("DOMContentLoaded", function(event) {
    updateTags()

    fetch(`/homepage/fireteam`)
        .then(response => response.json())
        .then(data => {
            displayCards(data);
        })
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
     let bothTags = tags.filter(function(tag) { return (tag.type === "post" || tag.type === "event"); });
     let typeVal = document.getElementById("type").value;
     let tagsSelector = document.getElementById("tagsList");
     tagsSelector.innerHTML = ""
     if (typeVal === "both"){
         bothTags.forEach(function(btag){
             let li = document.createElement("li");
             li.classList.add("dropdown-item", "form-control");
             let label = document.createElement("label");
             let checkbox = document.createElement("input");
             checkbox.type = "checkbox";
             checkbox.value = btag.content;
             label.appendChild(checkbox);
             label.appendChild(document.createTextNode(" "+ btag.content));
             li.appendChild(label);
             tagsSelector.appendChild(li);
         })

     }
     if (typeVal === "post"){
         postTags.forEach(function(ptag){
             let li = document.createElement("li");
             li.classList.add("dropdown-item");
             let label = document.createElement("label");
             let checkbox = document.createElement("input");
             checkbox.type = "checkbox";
             checkbox.value = ptag.content;
             checkbox.classList.add("form-check-input");
             label.appendChild(checkbox);
             label.appendChild(document.createTextNode(ptag.content));
             li.appendChild(label);
             tagsSelector.appendChild(li);
         })
         }
     if (typeVal === "event"){
         eventTags.forEach(function(etag){
             let li = document.createElement("li");
             li.classList.add("dropdown-item");
             let label = document.createElement("label");
             let checkbox = document.createElement("input");
             checkbox.type = "checkbox";
             checkbox.value = etag.content;
             label.appendChild(checkbox);
             label.appendChild(document.createTextNode(etag.content));
             li.appendChild(label);
             tagsSelector.appendChild(li);
         })
     }

 }

//function to build the cards in the tabs
function displayCards(cards) {
    let whichTab = document.querySelector(".nav-tabs .active").getAttribute("href").substring(1);
    let contentCards = document.getElementById(whichTab);
    contentCards.innerHTML = "";
    console.log(whichTab);
    cards.forEach(function(cd) {
        contentCards.innerHTML += `<div class="card" style="">
			<div class="card-body">
			    <a href="/posts?id=${cd._id}">
			        <h5 class="card-title">${cd.title}</h5>
                </a>
                <a href="">
                    <h6 class="card-subtitle mb-2 text-muted">${cd.owner.name}</h6>
                </a>
				<p class="card-text">${cd.content}</p>
				<p class="card-text">${cd.timeCreated}</p>
			</div>
		</div>`
    });
};

// Define Function to Handle Feed and Search Events
function handleFeedAndSearch() {
    let searchText = document.getElementById("search").value;
    let ul = document.querySelector('#tagsList');
    let checkboxes = ul.querySelectorAll('input[type="checkbox"]');
    let selectedTags = [];
    for (let i = 0; i < checkboxes.length; i++) {
        if (checkboxes[i].checked) {
            selectedTags.push(checkboxes[i].value);
        }
    }
    let selectedType = document.getElementById("type").value;
    let selectedSort = document.getElementById("sort").value;
    let selectedTab = document.querySelector(".nav-tabs .active").getAttribute("href");

    console.log(selectedTags)


    fetch(`/homepage/info?typeP=${selectedType}&tabP=${selectedTab}&sortP=${selectedSort}&textP=${searchText}&tagsP=${selectedTags}`)
        .then(response => response.json())
        .then(data => {
            displayCards(data);
            //updateTags(data);
        })
        .catch(error => {
            console.error(error);
        });
}

// Add Event Listener to Feed Controls
let feedResults = document.querySelectorAll(".feedControl");
feedResults.forEach(function(feed) {
    feed.addEventListener("change", async function(){
        handleFeedAndSearch();
        feedResults = document.querySelectorAll(".feedControl");
    });
});

let taglistener = document.getElementById("type")
taglistener.addEventListener("change", updateTags);

// Add Event Listener to Search Button
document.getElementById("search-btn").addEventListener("click", handleFeedAndSearch);
document.addEventListener("keypress", function(e){
    if (e.key === "Enter"){
        handleFeedAndSearch();
    }
})
