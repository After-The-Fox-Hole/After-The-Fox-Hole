const express = require('express')
const User = require("../models/user");
const router = new express.Router;
const auth = require('../middleware/auth');
const app = require("../app");


///////sign up

router.post('/users',async (req,res)=>{
	let address = req.body.info.location.text
	let user = req.body
	let requestOptions = {
		method: 'GET',
		redirect: 'follow'
	};
	try{
		await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${process.env.GOOGLE_MAP_API}`, requestOptions)
			.then(response => response.json())
			.then(result => {
				user.info.location.type = "Point"
				user.info.location= { type: 'Point',coordinates: [result.results[0].geometry.location.lng, result.results[0].geometry.location.lat]}
			})
	}
	catch (e) {
		throw new Error("Error finding location")
	}
	try{
		const userDB = new User(user);
		await userDB.save();
		const token = await userDB.generateAuthToken()
		res.status(201).send({userDB, token})
	}
	catch (e){
		res.status(400).send(e);
	}
})



//////// log out

router.post('/users/logout', auth, async (req, res)=>{
	try{
		req.user.tokens = req.user.tokens.filter((token)=>{
			return token.token !== req.token
		})
		await req.user.save();
		res.send();
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
