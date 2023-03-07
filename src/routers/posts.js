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

router.get('/posts', auth, async (req,res)=>{
	let post;
	if(req.query.id){
		const id = req.query.id;
	try{
		post = await Post.findOne({_id:id});
	}
	catch (e) {
		res.status(400).send("No post found");
		return;
	}
		let user = req.user.clean();
		post = post.toObject();
		post._id = post._id.valueOf();
		post.owner = post.owner[0].valueOf();
		let edit=false;
		if(post.owner === user._id){
			edit=true
		}
		res.status(200).render('viewPost', ({user,post, edit}))
		return;
	}
	res.status(400).send("No post found");
})



module.exports = router;
