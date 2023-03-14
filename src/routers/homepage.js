const express = require('express')
const User = require("../models/user");
const Post = require("../models/posts")
const Tags = require("../models/tags")
const router = new express.Router;
const auth = require('../middleware/auth');

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
	let fireteam= await Following.findOne({owner:user._id});
	fireteam = !!fireteam;
	
	res.status(200).render("homepage", ({user, fireteam}))
});

router.post('/homepage/info', auth, async (req, res) =>{
	let results =[];
	let type = req.body.typeP;

	let tag = req.body.tagsP;

	let sort = req.body.sortP;

	let tab = req.body.tabP;

	let text = req.body.textP;
	// string text search
	let collection = null;
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
	
	let followers=[]
	if (tab === "#all"){
		if (type === "event") {
			results =	await Event.find({$and:filter}).sort(sorting)
		}
		if(type === "post"){
			results =	await Post.find({$and:filter}).sort(sorting)
		}
		
	}
	else{
		followers = await Following.find({owner:req.user.id})
		let following = [];
		for(let f of followers){

			let x = {"owner.id":f.following.id}

			following.push(x)
		}
		if(following.length !== 0){
			if (type === "event") {
				results = await Event.find({$and:[{$or:following}, {$and:filter}]}).sort(sorting)
			}
			if(type === "post"){
				results = await Post.find({$and:[{$or:following}, {$and:filter}]}).sort(sorting)
			}
		}
		
	}
	if(results.length === 0 && followers.length === 0){
		results = ["999"]
	}
	res.status(200).send(results)
})




module.exports = router;
