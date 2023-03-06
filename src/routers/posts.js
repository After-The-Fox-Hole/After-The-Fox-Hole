const express = require('express')
const User = require("../models/user");
const router = new express.Router;
const auth = require('../middleware/auth');
const app = require("../app");
const Post = require("../models/posts");


///////make a post

router.post('/posts',auth,async (req,res)=>{
	const post = new Post({
		...req.body,
		owner: req.user._id,
	});
	try{
		await post.save();
	}
	catch (e) {
		console.log(e)
		res.status(300).send(e.message)
		return
	}
	res.status(200).send(post);
	
	
	
	
	
	
})



module.exports = router;
