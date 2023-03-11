const express = require('express')
const User = require("../models/user");
const Post = require("../models/posts")
const Tags = require("../models/tags")
const router = new express.Router;
const auth = require('../middleware/auth');
const app = require("../app");
const Event = require("../models/event");
const Following = require("../models/following");






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

router.post('/homepage/info', auth, async (req, res) =>{
	let results =[];
	let type = req.body.typeP;
	/// post/event/ string
	let tag = req.body.tagsP;
	//// array of strings
	let sort = req.body.sortP;
	/// sort, string
	let tab = req.body.tabP;
	/// fireteam / alll
	let text = req.body.textP;
	//// string text search
	let collection;
	let sorting={};
	 sorting[sort] = -1;
	let filter=[{
		title: {
			$regex: '.*' + text + '.*',
			$options: "i"
		}
	}]
	for (let t of tag){
		let x = {};
		x=	{
			tags:t
		}
		filter.push(x)
	}
	
		if (type === "event") {
			collection = Event;
		}
		if(type === "post"){
			collection = Post;
		}
		if (tab === "#all"){
			
			results= await collection.find({$and:filter}).sort(sorting)
			
	}
	else{
		let followers = await Following.find({owner:req.user.id})
		let following = [];
		for(let f of followers){
			
			let x = {"owner.id":f.following.id}
			
			following.push(x)
		}
		
		// let test = await collection.find({"owner.id":"640b98c4fe4c6cced79131b2"})
			
			// let test = await collection.find({$or:following})
			 results = await collection.find({$and:[{$or:following}, {$and:filter}]}).sort(sorting)
	}
	
	res.status(200).send(results)
})




module.exports = router;
