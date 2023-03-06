const app = require("../app");
const User = require("../models/user");
const Org = require("../models/org");
const express = require("express");
const router = new express.Router;

router.post('/login', async (req, res)=>{
	let token;
	let user;
		if (req.body.type === "user") {
			try{
				user = await User.findByCredentials(req.body.email, req.body.password);
			}
			catch (e) {
				res.status(400).send(e.message)
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
			res.status(400).send("No type selected");
			return
		}
		res.cookie("access_token", token, {httpOnly: true});
		res.status(200).render('profile', {user})
	
})

module.exports = router;
