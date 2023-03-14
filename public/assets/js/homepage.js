



//setting everything for initial page load with default options for filter/sort
document.addEventListener("DOMContentLoaded", function(event) {
    updateTags();
    handleFeedAndSearch();
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
     let typeVal = document.getElementById("type").value;
     let tagsSelector = document.getElementById("tagsList");
     tagsSelector.innerHTML = ""
     if (typeVal === "post"){
         let sortOptions = document.getElementById("sort");
         let options = sortOptions.getElementsByTagName("option");
         let lastOption = options[options.length - 1];
         if (lastOption.value === "date") {
             sortOptions.removeChild(lastOption);
         }
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
         let sortOptions = document.getElementById("sort");
         sortOptions.innerHTML += "<option value=\"date\">Upcoming Events</option>"
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
async function displayCards(cards) {
    let whichTab = document.querySelector(".nav-tabs .active").getAttribute("href").substring(1);
    let contentCards = document.getElementById(whichTab);
    contentCards.innerHTML = "";
    let contents = '';
    cards.forEach(function(cd) {
        
            let date = new Date(cd.timeCreated);
            let options = {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                // hour: 'numeric',
                // minute: 'numeric',
                // hour12: true,
                // timeZone: timeZ,
                // timeZoneName: 'short'
            };
            let cardCreated = date.toLocaleString('en-US', options);
        contents += `
        <div class="card mb-2 theseAreCards" >
			<div class="card-body">
			    <div class="row">
			        <div class="col-md-6 mt-2">
                        <a href="/`;
                            if(cd.date){
                                contents += "events"
                            }
                            else{
                                contents += "posts"
                            }
                            contents +=  `?id=${cd._id}">
                            <h2 class="card-title">${cd.title}</h2>
                        </a>
                    </div>
                    <div class="col-md-6 mt-2">
                        <span>Tags: </span>`;
                        for (let i = 0; i < cd.tags.length; i++) {
                                contents += `<span class="badge rounded-pill buttonStyle">${cd.tags[i]}</span> `;
                            };
                    contents += `</div>
                </div>
                <a href="/profile?id=${cd.owner.id}" >
                    <h5 class="card-subtitle">${cd.owner.name}</h5>
                </a>
				<p class="card-text cardContentEach my-2">${cd.content}</p>
				<p class="card-text my-2">${cardCreated}</p>
			</div>
		</div>`;
        contentCards.innerHTML = contents;
    }
            );
    const divA = document.querySelector('#tabCards');
    const divB = document.querySelector('.pagBtns');

    if (divA.scrollHeight > divA.clientHeight) {
        divB.style.display = 'block';
    } else {
        divB.style.display = 'none';
    }
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
    console.log(selectedTab)

    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            typeP: selectedType,
            tabP: selectedTab,
            sortP: selectedSort,
            textP: searchText,
            tagsP: selectedTags
        })
    };


    fetch('/homepage/info', requestOptions)
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

let tabFeedUpdate = document.querySelectorAll(".tabbing");
tabFeedUpdate.forEach(function(tab) {
    tab.addEventListener("click", async function(){
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

// Function to handle pagination
function pagination(results){
    let paginationArea = document.getElementById("paginationUl")
    let numPages;
    if (results%10 > 0){
        numPages = results/10;
    } else {
        numPages = results/10 + 1;
    }
    while(numPages > 0){
        let pageNum = 1
        paginationArea.innerHTML += `<li className="page-item"><a className="page-link" href="#">${pageNum}</a></li>`
        pageNum ++;
        numPages --;
    }
}

