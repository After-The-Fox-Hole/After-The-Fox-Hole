$(document).ready(async function(){
	let pics = await fetch("/profile/avatars");
	pics = await pics.json();
	let insert = $("#pictureModalInsert");
	for(let pic of pics){
		insert.append(`<a href="/profile/avatar/change?pic=${pic.image}"> <img class="pic-change" src="${pic.image}"></a>`)
	}
})

$("#changePasswordSubmit").click(async function(){
	
	if($("#passwordOne").val() === $("#passwordTwo").val()){
		if($("#passwordOne").val().length < 5){
			alert("Password to short");
			return;
		}
		let myHeaders = new Headers();
		myHeaders.append("Content-Type", "application/json");
		
		let raw = JSON.stringify({
			"password": $("#passwordOne").val()
		});
		
		let requestOptions = {
			method: 'POST',
			headers: myHeaders,
			body: raw,
			redirect: 'follow'
		};
		
		let result =  await fetch("/profile/edit/password", requestOptions)
		if(!result.redirected){
			result = await result.json();
			alert(result.Error);
		}
		else{
			window.location.href = result.url
		}
	}
	else{
		alert("Passwords did not match")
		return;
	}
	
	

})
