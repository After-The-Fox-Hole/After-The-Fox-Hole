function confirmUser(){
    let ask = confirm("Are you sure you want to delete?");
    if(ask === true){
        window.location="/events/delete?id=<%=user._id%>"
    }
}