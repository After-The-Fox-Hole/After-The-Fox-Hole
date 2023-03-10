const express = require('express')
const User = require("../models/user");
const Post = require("../models/posts")
const Tags = require("../models/tags")
const router = new express.Router;
const auth = require('../middleware/auth');
const app = require("../app");
const Event = require("../models/event");
const Following = require("../models/following");




///////make a event

router.get("/homepage/fireteam", auth, async (req, res)=>{
	let user = req.user
	let following = await Following.find({owner:user._id})
	let result = [];
	for (let fUsers of following){
		let x = await Post.findOne({'owner.id':fUsers.following.id})
		result.push(x);
	}
	
	for (let fUsers of following){
		let x = await Event.findOne({'owner.id':fUsers.following.id})
		result.push(x);
	}
	
	result = result.sort(function(a,b){
		if (a.createDate > b.createDate){
			return +1;
		}
		else{
			return -1;
		}
		
	})
	
	res.status(200).send(result);
});

router.get('/homepage',auth,async (req,res)=>{
	
	
	let user = req.user
	user = await user.clean();
	
	res.status(200).render("homepage", ({user}))
});

router.get('/homepage/info', auth, async (req, res) =>{
	let obj={}
	let results =[];
	let type = req.query.typeP;
	/// post/event/ string
	let tag = req.query.tagP;
	//// array of strings
	let sort = req.query.sortP;
	/// sort, string
	let tab = req.query.tabP;
	/// fireteam / alll
	let text = req.query.textP;
	//// string text search
	
	let result = []
	let tags = true
	let textOnly = true
	let sorting = {
	
	}
	if(sort === 'timeCreated'){
		sorting.timeCreated= -1
	}
	if(sort === "latestComment"){
		sorting.latestComment = -1
	}
	if (sort === "commentCount"){
		sorting.commentCount = -1
	}
	
	
	
	
	
	// await req.user.populate({
	// 	path: 'tasks',
	// 	match,
	// 	options: {
	// 		limit : parseInt(req.query.limit),
	// 		skip: parseInt(req.query.skip),
	// 		sort
	// 	}
	// })
	
	
	res.send(req.user.tasks)
	
	
	res.status(200).send(posts)
})




module.exports = router;
