const express = require('express')
const User = require("../models/user");
const Post = require("../models/posts")
const Tags = require("../models/tags")
const router = new express.Router;
const auth = require('../middleware/auth');
const app = require("../app");
const Event = require("../models/event");




///////make a event

router.get('/homepage',auth,async (req,res)=>{

	console.log("homepage fired")
	let user = req.user
	user = user.clean();
	let tags = await Tags.find();
	///// add tags
	
	res.status(200).render("homepage", ({user, tags}))
	
})

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
