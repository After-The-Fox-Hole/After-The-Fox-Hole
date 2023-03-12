const express = require('express')
const User = require("../models/user");
const router = new express.Router;
const auth = require('../middleware/auth');
const app = require("../app");
const Event = require("../models/event");
const Tags = require("../models/tags");
const Vote=require("../models/votes");
const Post =require("../models/posts");
const Comment =require("../models/comment");




router.post('/vote',auth,async (req,res)=>{
	let type = req.body.type;
	///post/ event
	let user = req.user;
	let attach = req.body.attach;
	//// if it's a comment id
	let master = req.body.master;
	/// query for the master load, event/post
	let voted = req.body.voted;
	
	let collection;
	
	let vote = {
		owner: user,
		master:master,
		model_typeR:type,
		value:value
	}
	if(attach){
		vote.attach = attach
	}
	
	vote = await new Vote(vote);
	await vote.save();
	
	if (type === "event"){
		collection = Event;
	}
	else{
		collection = Post;
	}
	await collection.findByIdAndUpdate({master},{$inc:{votes:voted}})
	if (attach){
		Comment.findByIdAndUpdate({attach},{$inc:{votes:voted}} )
	}
	
	res.status(200).send();
})




module.exports = router;
