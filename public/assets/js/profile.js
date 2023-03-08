const paragraph = document.getElementById("edit");
const edit_button = document.getElementById("edit-button");
const end_button = document.getElementById("end-editing");

edit_button.addEventListener("click", function() {
    paragraph.contentEditable = true;
} );

end_button.addEventListener("click", function() {
    paragraph.contentEditable = false;
} )