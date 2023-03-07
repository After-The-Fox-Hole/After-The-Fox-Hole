const express = require('express')
const User = require("../models/user");
const router = new express.Router;
const auth = require('../middleware/auth');
const app = require("../app");



router.get("/profile", auth, async (req,res)=>{
	const match={};
	const sort = {};
	
	
	const posts = await req.user.populate({
		path: "posts"
		// match,
		// options: {
		// 	limit : parseInt(req.query.limit),
		// 	skip: parseInt(req.query.skip),
		// 	// sort
		// }
	})
	
	const events = await req.user.populate({
		path: "posts"
		// match,
		// options: {
		// 	limit : parseInt(req.query.limit),
		// 	skip: parseInt(req.query.skip),
		// 	// sort
		// }
	})
	
	
	let user = req.user.clean();
	console.log(user)
	console.log(req.user.posts)
	
	
	res.status(200).render("profile", ({user, posts, events, edit}))
	
})

module.exports = router;
