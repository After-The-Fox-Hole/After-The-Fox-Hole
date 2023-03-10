const express = require('express')
const User = require("../models/user");
const router = new express.Router;
const auth = require('../middleware/auth');
const app = require("../app");
const Post = require("../models/posts");
const Comment = require("../models/comment")



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
		let ownerAvatar = await User.findOne({_id: post.owner.id})
		ownerAvatar = ownerAvatar.avatar
		post = post.toObject();
		post.avatar = ownerAvatar
		let edit=false;
		if(post.owner === user._id){
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
					if (x.attach === y.id) {
						if (!y.nested) {
							y.nested = [x]
						} else {
							if(!y.nested.includes(x)){
								y.nested.push(x)
							}
						}
						y.nested = loopTwo(y.nested, comments)
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
				else if (x.timeCreated < y.timeCreated){
					return -1;
				}
				return +1;
			})
			for (let x of arr){
				html = html + `<div style="padding-left: ${count}em">${x.content}</div>`
				if(x.nested){
					if(count < 6){
						html = commentLoop(x.nested, html, count+1)
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
		/// need owner
		res.status(200).render('viewPost', ({user,post, edit, cHtml}))
		return
	}
	res.status(200).redirect('/profile')
})

router.get("/posts/create", auth, async (req, res)=>{
	let user = req.user
	user = user.clean();
	res.status(200).render("createPost", ({user}));
})

module.exports = router;
