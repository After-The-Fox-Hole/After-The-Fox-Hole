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
		
		
		
		const loopOne =(arr)=>{
			let a = []
			
			for (let x of arr){
				if (x.attach.length === 0){
					a.push(x);
				}
			}
			return a
		}
		
		let result = loopOne(comments)
		
		const loopTwo = (arr,arrM) =>{
			for (let x of arrM) {
				for (let y of arr) {
					if(x.attach.length>0) {
						if (x.attach[0].valueOf() === y._id.valueOf()) {
							if (!y.nested) {
								y.nested = [x]
							} else {
								if (!y.nested.includes(x)) {
									y.nested.push(x)
								}
							}
							y.nested = loopTwo(y.nested, comments)
						}
					}
				}
			}
			return arr
		}
		
		result = loopTwo(result,comments)
		
		const commentLoop = (arr, html, count)=>{
			
			arr = arr.sort(function(x,y){
				if (x.votes > y.votes){
					return -1;
				}
				if (x.votes < y.votes){
					return +1;
				}
				if (x.timeCreated > y.timeCreated){
					return -1;
				}
				if (x.timeCreated < y.timeCreated){
					return +1;
				}
				
				
				
				
			})
			for (let x of arr){
				html = html + `<div class="border my-1 p-2" style="margin-left: ${count}em">
									<div>${x.owner.name}</div>
									<div class="mb-2">${x.content}</div>
									<div class="d-flex justify-content-end">
									<form action="/comments/add" method="post">
										<input class="visually-hidden" name="master" value="${post._id}">
										<input class="visually-hidden" name="attach" value="${x._id}">
										<input class="visually-hidden" name="type" value="post">
										<input class="visually-hidden scrollField" name="scroll" value="">
										<textarea class="visually-hidden makeComment" name="content" type="text"></textarea>
										<button class="visually-hidden makeComment reset" type="submit">Submit</button>
										<button class="visually-hidden makeComment" type="button">Cancel</button>
									</form>
									
									<button class="btn-sm openComment">reply</button>
									</div>
								</div>`
				if(x.nested){
					if(count < 17){
						html = commentLoop(x.nested, html, count+4)
					}
					else{
						html = commentLoop(x.nested, html, count)
					}
				}
			}
			return html
		}
		let cHtml = "";
		cHtml = commentLoop(result, cHtml, 0);
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
