const express = require('express')
const router = new express.Router;
const auth = require('../middleware/auth');
const Events = require("../models/event")
const Attending = require("../models/attending")




///////make a event
////////////////////////// ?id=

router.get('/attending/add',auth,async (req,res)=>{
	const eventId = req.query.id
	let attending = {
		owner:{
			id:req.user._id,
			name: req.user.displayName
		},
		model_type:"user",
	}

	attending.event = await Events.findById(eventId);
	attending = await new Attending(attending)
	await attending.save();
	res.status(200).redirect(`/events?id=${eventId}`)
	
})
////////////////////////// ?id=
router.get('/attending/remove',auth,async (req,res)=>{
	let eventId = await Events.findById(req.query.id);
	let attending = await Attending.findOne({$and:[{'owner.id': req.user._id}, {event:eventId._id}]})
	await attending.deleteOne();
	
	res.status(200).redirect(`/events?id=${eventId._id}`)
	
})




module.exports = router;
