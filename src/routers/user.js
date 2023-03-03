const express = require('express')
const User = require("../models/user");
const router = new express.Router;
const auth = require('../middleware/auth');
const app = require("../app");


///////sign up

router.post('/users',async (req,res)=>{
	const user = new User(req.body);
	try{
		await user.save();
		const token = await user.generateAuthToken()
		res.status(201).send({user, token})
	}
	catch (e){
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
