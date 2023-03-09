const express = require('express')
const User = require("../models/user");
const router = new express.Router;
const auth = require('../middleware/auth');
const app = require("../app");
const {add} = require("nodemon/lib/rules");


///////sign up

router.post('/users',async (req,res)=>{
	console.log(req.body)
	
	let address = req.body.location
	let user = {
		info:{
			location:{
				text: address
			},
			currentJob: req.body.currentJob,
			name:{
				first: req.body.firstN,
				last: req.body.last
			},
			email:req.body.email,
			service:{
				branch: req.body.branch,
				status: req.body.status
			}
		},
		displayName: req.body.displayName,
		password: req.body.password
	}
	
	let requestOptions = {
		method: 'GET',
		redirect: 'follow'
	};
	try{
		await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${process.env.GOOGLE_MAP_API}`, requestOptions)
			.then(response => response.json())
			.then(result => {
				user.info.location.type= 'Point';
				user.info.location.coordinates = [result.results[0].geometry.location.lng, result.results[0].geometry.location.lat];
			})
	}
	catch (e) {
		let error={
			error:"Location could not be found"
		}
		res.status(200).render("registerUser", ({error}));
		return;
	}
	try{
		user = new User(user);
		await user.save();
		const token = await user.generateAuthToken()
		res.cookie("access_token", token, {httpOnly: true});
		res.status(200).redirect("/profile");
	}
	catch (e){
		res.status(400).send(e);
	}
})



//////// log out

router.get('/users/logout', auth, async (req, res)=>{
	try{
		req.user.tokens = req.user.tokens.filter((token)=>{
			return token.token !== req.token
		})
		await req.user.save();
		res.status(200).render("login");
	}
	catch (e){
		res.status(500).send();
	}
})

router.post('/users/logoutAll', auth, async (req, res)=>{
	try{
		req.user.tokens = [];
		await req.user.save();
		res.send();
	}
	catch (e){
		res.status(500).send();
	}
});

router.delete('/users/me',auth, async (req, res)=>{
	try {
		await req.user.remove();
		res.send(req.user)
	}
	catch (e){
		res.status(500).send(e)
	}
})
module.exports = router;
