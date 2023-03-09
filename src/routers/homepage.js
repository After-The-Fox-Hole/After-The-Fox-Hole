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
	let posts = [];
	for (let fUsers of following){
		let x = await Post.findOne({'owner.id':fUsers.following.id})
		posts.push(x);
	}
	res.status(200).send(posts);
});

router.get('/homepage',auth,async (req,res)=>{
	
	
	let user = req.user
	user = user.clean();
	
	res.status(200).render("homepage", ({user}))
});

router.get('/homepage/info', auth, async (req, res) =>{
	let obj={}
	let results =[];
	let type = req.query.typeP;
	let tag = req.query.tagP;
	let sort = req.query.sortP;
	let tab = req.query.tabP;
	let text = req.query.textP;
	
	///// owner of post need to be first and last , need query by id to get real owner
	let posts = await Post.find();
	
	
	
	res.status(200).send(posts)
})




module.exports = router;
