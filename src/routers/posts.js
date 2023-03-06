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
	
	
	
	
	
	// let address = req.body.info.location.text
	// let user = req.body
	// let requestOptions = {
	// 	method: 'GET',
	// 	redirect: 'follow'
	// };
	// try{
	// 	await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${process.env.GOOGLE_MAP_API}`, requestOptions)
	// 		.then(response => response.json())
	// 		.then(result => {
	// 			user.info.location.type = "Point"
	// 			user.info.location= { type: 'Point',coordinates: [result.results[0].geometry.location.lng, result.results[0].geometry.location.lat]}
	// 		})
	// }
	// catch (e) {
	// 	throw new Error("Error finding location")
	// }
	// try{
	// 	const userDB = new User(user);
	// 	await userDB.save();
	// 	const token = await userDB.generateAuthToken()
	// 	res.status(201).send({userDB, token})
	// }
	// catch (e){
	// 	res.status(400).send(e);
	// }
})



//////// log out

module.exports = router;
