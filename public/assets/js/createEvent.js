async function updateTags() {
    let tagsSelector = document.getElementById("tagsList")
    let tags;
    try {
        tags = await fetch(`/tags`)
        tags = await tags.json();

    } catch (e) {
        console.error(e);
    }
    let eventTags = tags.filter(function(tag) { return tag.type === "event"; });
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
    });
}
updateTags()