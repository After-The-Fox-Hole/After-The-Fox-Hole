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
	let user = await req.user.clean();


	let edit=false;
	if(event.owner.id === user._id){
		edit=true
	}
	res.status(200).render('viewEvent', ({user,event, edit}))
})

router.get("/events/create", auth, async (req, res)=>{
	
	let user = req.user
	user = await user.clean();
	res.status(200).render("createEvent", ({user}));
	
	})

router.get('/events/view', auth,async (req,res)=>{
	let id = req.query.id
	let event = await Event.findOne({_id:id})
	let user = req.user
	user = await user.clean();
	res.status(200).render("viewEvent", ({user, event}))
	
	//// comments for events and handling and owner
	
})


module.exports = router;
