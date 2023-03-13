const express = require('express')
const User = require("../models/user");
const Followers = require("../models/following");
const router = new express.Router;
const auth = require('../middleware/auth');

const Post = require("../models/posts");
const Event = require("../models/event");
const Avatar = require("../models/avatars");




router.get("/profile", auth, async (req,res)=>{
	const match={};
	const sort = {};
	
	let owner = req.query.id;
	
	owner = await User.findOne({_id:owner})
	const posts = await Post.find({'owner.id':owner._id})
	const events = await Event.find({'owner.id':owner._id})
	let edit = false;
	
	let user = await req.user.clean();
	owner = await owner.clean();
	if (user._id === owner._id){
		edit = true;
	}
	owner.events = events
	owner.posts = posts
	owner.followers =  await Followers.find({owner:owner._id})
	
	let fireteam = await Followers.findOne({$and:[{owner:user._id}, {"following.id": owner._id}]})
	console.log(fireteam, user._id, owner._id)
	if(fireteam){
		fireteam = true;
	}
	else{
		fireteam = false
	}
	
	res.status(200).render("profile", ({user,owner, edit, fireteam}))
	
})

router.get("/profile/edit", auth, async (req, res)=>{
	
	let user = req.user;
	user = await user.clean();
	
	
	
	res.status(200).render("editProfile", ({user}))
})

router.post("/profile/edit", auth, async (req,res) =>{
	let user = req.user
	let attempt = {
		location: req.body.location,
		
	}
	let options = {
		info: {
			service: {
				branch: req.body.branch,
				status: req.body.status
			},
			location: {
				text: req.body.location
			},
		},
			currentJob:req.body.currentJob
	}
	
	let original = await User.findById(user.id)
	if (options.info.location.text !== req.user.info.location.text){
		try{
			await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${process.env.GOOGLE_MAP_API}`)
				.then(response => response.json())
				.then(result => {
					original.info.location.type= 'Point';
					original.info.location.coordinates = [result.results[0].geometry.location.lng, result.results[0].geometry.location.lat];
				})
		}
		catch (e) {
			attempt.error = "Could not find location"
			user = req.user
			user = await user.clean()
			res.status(200).render("editProfile", ({user, attempt}))
			return;
		}
	}
	
	if(options.currentJob !== req.user.currentJob){
		original.currentJob = options.currentJob
	}
	
	if(options.info.service.status !== req.user.info.service.status){
		original.info.service.status= options.info.service.status
	}
	
	if (options.info.service.branch !== req.user.info.service.branch){
		original.info.service.branch = options.info.service.branch
	}
	
	try{
		await original.save();
	}
	catch (e) {
		attempt.error = "Could not save profile"
		let user = req.user
		user = await user.clean();
		res.status(200).render("editProfile", ({user, attempt}))
		return;
	}
	
	
	res.status(200).redirect(`/profile?id=${user._id}`)
	
	
})

router.get("/profile/avatars", auth, async (req, res)=>{
	let pics =await Avatar.find()
	
	res.status(200).send(pics)
})

router.get("/profile/avatar/change", auth, async (req, res)=>{
	let user = req.user;
	let choice = req.query.pic
	
	
	try{
		user = await User.findOneAndUpdate({_id:user._id},{avatar:choice}, {new:true})
	}
	catch (e) {
	
	}
	user = await user.clean();
	
	res.status(200).render("editProfile", ({user}))
	
})

router.post("/profile/edit/password", auth, async (req, res)=>{
	
	let user = req.user
	user.password = req.body.password
	try{
		await user.save();
	}
	catch (e) {
		
		let result = {Error:"could not save password"}
		res.status(200).send(result)
		return
	}
	res.status(200).redirect(`/profile/edit`)
})


module.exports = router;
