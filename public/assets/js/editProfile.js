$(document).ready(async function(){
	let pics = await fetch("/profile/avatars");
	pics = await pics.json();
	let insert = $("#pictureModalInsert");
	let modo = pics.length%4
	for(let i = 0; i < pics.length; i++){
		if(i > (pics.length-1 - modo)){
			insert.append(`<div class="col"><a href="/profile/avatar/change?pic=${pics[i].image}"> <img class="img-fluid pic-change" src="${pics[i].image}"></a></div>`)
		}
		else{
			insert.append(`<div class="col mb-3"><a href="/profile/avatar/change?pic=${pics[i].image}"> <img class="img-fluid pic-change" src="${pics[i].image}"></a></div>`)
		}
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
