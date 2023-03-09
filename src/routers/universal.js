const app = require("../app");
const User = require("../models/user");
const Org = require("../models/org");
const express = require("express");
const auth = require("../middleware/auth");
const router = new express.Router;

router.post('/login', async (req, res)=>{
	let attempt = {
		email: req.body.email,
		
	}
	let token;
	let user;
		if (req.body.type === "user") {
			try{
				user = await User.findByCredentials(req.body.email, req.body.password);
			}
			catch (e) {
				attempt.error = "Could not find email and password match"
				
				res.status(200).render("login", ({attempt}))
				return;
			}
			token = await user.generateAuthToken();
			
		} else if (req.body.type === "org") {
			try{
				user = await Org.findByCredentials(req.body.email, req.body.password);
			}
			catch (e) {
				res.status(400).send(e.message)
				return;
			}
			token = await user.generateAuthToken();
		} else {
			res.status(400)
			console.log("no type selected")
			return
		}
		
		user._id = user._id.valueOf();
		
		res.cookie("access_token", token, {httpOnly: true});
		res.status(200).redirect(`/profile?id=${user._id}`)
	
})


router.post('/logout', auth, async (req, res)=>{
	try{
		req.user.tokens = req.user.tokens.filter((token)=>{
			return token.token !== req.token
		})
		await req.user.save();
		res.status(200).render("login")
	}
	catch (e){
		res.status(500).send();
	}
})

router.get('/register', async (req, res)=>{
	res.status(200).render("registerUser");
})




module.exports = router;
