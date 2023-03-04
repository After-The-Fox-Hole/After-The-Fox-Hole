const express = require('express')
const User = require("../models/user");
const router = new express.Router;
const auth = require('../middleware/auth');
const app = require("../app");


///////sign up

router.post('/users',async (req,res)=>{
	let address = req.body.info.location.coordinates
	let user = req.body
	let requestOptions = {
		method: 'GET',
		redirect: 'follow'
	};
	try{
		console.log(user);
		await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${process.env.GOOGLE_MAP_API}`, requestOptions)
			.then(response => response.json())
			.then(result => {
				console.log(result.results[0].geometry.location.lng, result.results[0].geometry.location.lat);
				user.info.location.type = "Point"
				user.info.location= { type: 'Point',coordinates: [result.results[0].geometry.location.lng, result.results[0].geometry.location.lat]}
			})
	}
	catch (e) {
		console.log(e)
		throw new Error("Error finding location")
	}
	console.log(user);
	try{
		const userDB = new User(user);
		await userDB.save();
		const token = await userDB.generateAuthToken()
		res.status(201).send({userDB, token})
	}
	catch (e){
		console.log(e);
		res.status(400).send(e);
	}
})

/////// log in
router.post('/users/login', async (req, res)=>{
	try{
		const user = await User.findByCredentials(req.body.email, req.body.password);
		const token = await user.generateAuthToken();
		if (user.isAdmin){
			res.cookie("access_token", token, { httpOnly: true });
			res.redirect(301, `/admin`)
		}
		else{
			res.status(200).send("Awaiting admin approval")
		}
	}
	catch (e){
		res.status(400).send("Bad credentials")
	}
})

//////// log out

router.post('/users/logout', auth, async (req, res)=>{
	try{
		req.user.tokens = [];
		await req.user.save();
		res.redirect(301, `/`);
	}
	catch (e){
		res.status(500).send("could not logout");
	}
})

module.exports = router;
