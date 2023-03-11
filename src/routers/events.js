const express = require('express')
const User = require("../models/user");
const router = new express.Router;
const auth = require('../middleware/auth');
const app = require("../app");
const Event = require("../models/event");
const Tags = require("../models/tags");
const Post = require("../models/posts");




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
	let owner = await User.findOne({_id: event.owner.id})
	
	let edit=false;
	if(owner.id.valueOf() === user._id){
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

router.get("/events/edit", auth,async(req, res)=>{
	const id = req.query.id;
	let event = await Event.findOne({_id:id});
	let user = await req.user.clean();
	let tags = await Tags.find({type:"event"})
	
	
	res.status(200).render('editEvent', ({user,event, tags}))
} )

router.post("/events/update", auth, async (req, res)=>{
	let event = await Event.findById(req.body.id)
	let tags = await Tags.find({type:"event"})
	let attempt = {text:req.body.location};
	let options={};
		options.location={}
		options.location.text = req.body.location
		options.title = req.body.title
		options.content = req.body.content
		options.tags = req.body.tags
	
	try{
		await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${req.body.location}&key=${process.env.GOOGLE_MAP_API}`)
			.then(response => response.json())
			.then(result => {
				options.location.type= 'Point';
				options.location.coordinates = [result.results[0].geometry.location.lng, result.results[0].geometry.location.lat];
			})
	}
	catch (e) {
		attempt.error = "Could not find location"
		let user = req.user
		user = await user.clean()
		res.status(200).render("editEvent", ({event,user, attempt, tags}))
		return;
	}
	
	 await Event.findOneAndUpdate({_id:req.body.id}, options, {new: true})
	res.status(200).redirect(`/events?id=${event._id}`)
	
	
})

module.exports = router;
