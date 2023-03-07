const express = require('express')
const User = require("../models/user");
const router = new express.Router;
const auth = require('../middleware/auth');
const app = require("../app");
const Event = require("../models/event");




///////make a event

router.post('/events',auth,async (req,res)=>{
	const event = new Event({
		...req.body,
		owner: req.user._id,
	});
	try{
		await event.save();
	}
	catch (e) {
		console.log(e)
		res.status(300).send(e.message)
		return
	}
	res.status(200).send(event);
})

router.get('/events', auth, async (req,res)=>{
	const id = req.query.id;
	let event = await Event.findOne({_id:id});
	let user = req.user.clean();
	event = event.toObject();
	event._id = event._id.valueOf();
	event.owner = event.owner[0].valueOf();
	let edit=false;
	if(event.owner === user._id){
		edit=true
	}
	res.status(200).render('viewEvent', ({user,event, edit}))
})



module.exports = router;
