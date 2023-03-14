const express = require('express')
const router = new express.Router;
const auth = require('../middleware/auth');
const Event = require("../models/event");
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
	let value = req.body.value

	let scroll = req.body.scroll

	

	let vote = {
		owner: user,
		master:master,
		model_TypeR:type,
		value:value
	}
	if(attach){
		vote.attach = attach
	}
	try{

		if (value !== "-1"){
			vote = await new Vote(vote);
			await vote.save();
		}
		if (type === "event" && !attach){
			await Event.findByIdAndUpdate(master,{$inc:{votes:value}})

		}
		else{
			if(!attach) {
				await Post.findByIdAndUpdate(master, {$inc: {votes: value}})
			}
		}

		if (attach){
			await Comment.findByIdAndUpdate(attach,{$inc:{votes:value}} )
		}
		if(value === "-1"){
			if(attach){
				await Vote.deleteOne({$and:[{owner:user}, {attach:attach}]})
			}
			else{
				await Vote.deleteOne({$and:[{owner:user}, {master:master}]})
			}
		}

	}
	catch (e) {
		console.log(e)
	}

	if (!scroll){
		scroll = 0;
	}
	if (type === "post"){
		res.status(200).redirect(`/posts?id=${master}&scroll=${scroll}`)

	}
	else{
		res.status(200).redirect(`/events?id=${master}&scroll=${scroll}`)
	}
	
	
})




module.exports = router;
