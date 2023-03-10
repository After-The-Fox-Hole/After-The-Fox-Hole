$(document).ready(async function(){
	let pics = await fetch("/profile/avatars");
	pics = await pics.json();
	let insert = $("#pictureModalInsert");
	for(let pic of pics){
		insert.append(`<a href="/profile/avatar/change?pic=${pic.image}"> <img class="pic-change" src="${pic.image}"></a>`)
	}
})
