const app = require("../app");
const User = require("../models/user");
const Org = require("../models/org");
const express = require("express");
const router = new express.Router;

router.post('/login', async (req, res)=>{
	let token;
	try {
		if (req.body.type === "user") {
			let login = await User.findByCredentials(req.body.email, req.body.password);
			token = await login.generateAuthToken();
			
		} else if (req.body.type === "org") {
			let login = await Org.findByCredentials(req.body.email, req.body.password);
			token = await login.generateAuthToken();
			
		} else {
			res.status(400).send("No type selected")
		}
		res.cookie("access_token", token, {httpOnly: true});
		res.redirect(301, `/profile`)
	}
	catch (e) {
		console.log(e)
		res.status(400).send("Bad credentials")
	}
})

module.exports = router;
