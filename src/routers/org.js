const express = require('express')
const Org = require("../models/org");
const router = new express.Router;
const auth = require('../middleware/auth');



///////sign up

router.post('/orgs',async (req,res)=>{
	let address = req.body.info.location.text
	let org = req.body
	let requestOptions = {
		method: 'GET',
		redirect: 'follow'
	};
	try{
		await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${process.env.GOOGLE_MAP_API}`, requestOptions)
			.then(response => response.json())
			.then(result => {
				org.info.location.type = "Point"
				org.info.location= { type: 'Point',coordinates: [result.results[0].geometry.location.lng, result.results[0].geometry.location.lat]}
			})
	}
	catch (e) {
		throw new Error("Error finding location")
	}
	try{
		const orgDB = new Org(org);
		await orgDB.save();
		const token = await orgDB.generateAuthToken()
		res.status(201).send({orgDB, token})
	}
	catch (e){
		res.status(400).send(e);
	}
})

/////// log in
// router.post('/orgs/login', async (req, res)=>{
// 	try{
// 		const org = await Org.findByCredentials(req.body.email, req.body.password);
// 		const token = await org.generateAuthToken();
// 		// if (org.isAdmin){
// 		// 	res.cookie("access_token", token, { httpOnly: true });
// 		// 	res.redirect(301, `/admin`)
// 		// }
// 		// else{
// 		// 	res.status(200).send("Awaiting admin approval")
// 		// }
// 	}
// 	catch (e){
// 		res.status(400).send("Bad credentials")
// 	}
// })

//////// log out

router.post('/orgs/logout', auth, async (req, res)=>{
	try{
		req.org.tokens = req.org.tokens.filter((token)=>{
			return token.token !== req.token
		})
		await req.org.save();
		res.send();
	}
	catch (e){
		res.status(500).send();
	}
})

router.post('/orgs/logoutAll', auth, async (req, res)=>{
	try{
		req.org.tokens = [];
		await req.org.save();
		res.send();
	}
	catch (e){
		res.status(500).send();
	}
})

router.delete('/orgs/me',auth, async (req, res)=>{
	try {
		await req.org.remove();
		res.send(req.org)
	}
	catch (e){
		res.status(500).send(e)
	}
})

module.exports = router;
