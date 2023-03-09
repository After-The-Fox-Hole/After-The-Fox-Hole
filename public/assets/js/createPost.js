async function showTags(){
    let tagsSelector = document.getElementById("tagsList");
    tagsSelector.innerHTML=""
    let tags;
    try{
        tags = await fetch(`/tags`)
        tags = await tags.json();
    }
    catch (e){
        console.error(e);
    }

    let postTags = tags.filter(function(tag){ return tag.type === "post";});

    postTags.forEach(function(ptag){
        let li = document.createElement("li");
        li.classList.add("dropdown-item");
        let label = document.createElement("label");
        let checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.value = ptag.content;
        label.appendChild(checkbox);
        label.appendChild(document.createTextNode(ptag.content));
        li.appendChild(label);
        tagsSelector.appendChild(li);
    })
};