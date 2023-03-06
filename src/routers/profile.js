const express = require('express')
const User = require("../models/user");
const router = new express.Router;
const auth = require('../middleware/auth');
const app = require("../app");



router.get("/profile", auth, async (req,res)=>{
	const match={};
	const sort = {}
	
	
	await req.user.populate({
		path: "posts"
		// match,
		// options: {
		// 	limit : parseInt(req.query.limit),
		// 	skip: parseInt(req.query.skip),
		// 	// sort
		// }
	})
	console.log(req.user.posts)
	res.status(200).send(req.user)
	
})

module.exports = router;
