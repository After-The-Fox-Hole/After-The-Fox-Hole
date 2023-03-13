const express = require('express')
const router = new express.Router;
const auth = require('../middleware/auth');
const Following =require("../models/following");


router.post("/fireteam/add", auth, async (req, res)=>{
	let following = {
		following:{
			id: req.body.ownerId,
			name: req.body.displayName
		},
		owner:req.user._id
	}
	console.log(following)
	try{
		following = await new Following(following);
		await following.save();
	}
	catch (e) {
		console.log(e)
	}

	
	res.status(200).redirect(`/profile?id=${req.body.ownerId}`)
})

router.post("/fireteam/remove", auth, async (req, res)=>{
	console.log(req.body.ownerId)
	try{
		await Following.findOneAndDelete({$and:[{owner: req.user._id}, {"following.id": req.body.ownerId}]})
	}
	catch (e) {
		console.log(e)
	}
	
	
	res.status(200).redirect(`/profile?id=${req.body.ownerId}`)
})



module.exports = router;
