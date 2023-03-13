const express = require('express')
const User = require("../models/user");
const router = new express.Router;
const auth = require('../middleware/auth');
const app = require("../app");
const Post = require("../models/posts");
const Tags = require("../models/tags");
const Comment = require("../models/comment")
const {response} = require("express");
const format = require("date-format");
const Votes = require("../models/votes");
const Helper = require("../JS/functions")


///////make a post

router.post("/posts/update", auth, async (req, res)=>{
	let options={};
		options.title = req.body.title
		options.content = req.body.content
		options.tags = req.body.tags
	
	await Post.findOneAndUpdate({_id:req.body.id}, options)
	
	res.status(200).redirect(`/posts?id=${post._id}`)
	
	
})

router.post('/posts',auth,async (req,res)=>{
	const post = new Post({
		title:req.body.title,
		content:req.body.content,
		owner:{
				id:req.user._id,
				name:req.user.displayName
				},
		model_type:"user",
		timeCreated: format('yyyy-MM-ddThh:mm', new Date())
	});
	try{
		await post.save();
	}
	catch (e) {
		console.log(e)
		res.status(300).send(e.message)
		return
	}
	res.status(200).redirect(`/posts?id=${post._id}`);
})

router.get('/posts', auth, async (req,res)=>{
	let votes = await Votes.find({$and:[{owner:req.user._id}, {master:req.query.id}]})
	if(votes){
		votes = votes.map(function(v){
			return v.attach.valueOf()
		})
	}
	let scroll = req.query.scroll;
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
		
		let user = await req.user.clean();
		let owner = await User.findOne({_id: post.owner.id})
		let ownerAvatar = owner.avatar
		post = post.toObject();
		post.avatar = ownerAvatar
		let edit=false;
		if(owner._id.valueOf() === user._id){
			edit=true
		}
		let comments = await Comment.find({master:post._id})
		
		let cHtml ="";
		try{
			cHtml = await Helper.commentLoop(comments,votes,post,"post")
			
		}
		catch (e) {
			console.log(e)
		}
		
		
		if (!scroll){
			scroll = 0;
		}
		res.status(200).render('viewPost', ({user,post, edit, cHtml, scroll}))
		return
	}
	res.status(200).redirect('/profile')
})

router.get("/posts/create", auth, async (req, res)=>{
	let user = req.user
	user = await user.clean();
	res.status(200).render("createPost", ({user}));
})

router.get('/posts/edit', auth, async (req, res)=>{
	
	let post = await Post.findById(req.query.id)
	let user = req.user;
	user = await user.clean();
	let tags = await Tags.find({type:"post"})
	res.status(200).render("editPost", ({user, post, tags}))
})



module.exports = router;
