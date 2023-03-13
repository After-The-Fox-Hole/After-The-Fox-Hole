const express = require('express')
const User = require("../models/user");
const router = new express.Router;
const auth = require('../middleware/auth');
const app = require("../app");
const Event = require("../models/event");
const Tags = require("../models/tags")
const Comments = require("../models/comment")
const Posts = require("../models/posts")




router.post('/comments/add',auth,async (req,res)=>{
	
	
	let master = req.body.master;
	let user = req.user;
	let attach = req.body.attach;
	let content = req.body.content;
	let type = req.body.type
	let collection;

	
	
	let comment = {
		content: content,
		owner:{
			id:user.id,
			name:user.displayName,
		},
		model_type: "user",
		master:master,
		model_typeM:type,
		timeCreated: Date.now()
	}

	if(attach){
		comment.attach = attach
	}
	
	if (type === "post"){
		collection = Posts;
		type = "posts";
	}
	if (type === "event"){
		collection = Event;
		type = "events"
	}

	try{

		await collection.findByIdAndUpdate(master, {$inc:{commentCount:1}, latestComment:Date.now()})
		comment =  await new Comments(comment);
		await comment.save();
	}
	catch (e) {
		console.log(e)
	}

	
	res.status(200).redirect(`/${type}?id=${master}&scroll=${req.body.scroll}`);
	

})




module.exports = router;
