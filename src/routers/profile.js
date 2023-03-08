const express = require('express')
const User = require("../models/user");
const Followers = require("../models/following");
const router = new express.Router;
const auth = require('../middleware/auth');
const app = require("../app");
const Post = require("../models/posts");



router.get("/profile", auth, async (req,res)=>{
	const match={};
	const sort = {};
	
	let owner = req.query.id;
	owner = await User.findOne({_id:owner})
	const posts = await Post.find({owner:owner._id})
	
	// const events = await req.user.populate({
	// 	path: "posts"
	// 	// match,
	// 	// options: {
	// 	// 	limit : parseInt(req.query.limit),
	// 	// 	skip: parseInt(req.query.skip),
	// 	// 	// sort
	// 	// }
	// })
	let edit = false;
	
	let user = req.user.clean();
	owner = owner.clean();
	if (user._id === owner._id){
		edit = true;
	}
	owner.followers =  await Followers.find({owner:owner._id})
	
	
	
	res.status(200).render("profile", ({user, posts, owner, edit}))
	
})

module.exports = router;
