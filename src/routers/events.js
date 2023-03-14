const express = require('express')
const User = require("../models/user");
const router = new express.Router;
const auth = require('../middleware/auth');

const Event = require("../models/event");
const Tags = require("../models/tags");

const format = require('date-format');
const Comment = require("../models/comment");
const Votes = require("../models/votes");
const Helper = require("../JS/functions");
const Post = require("../models/posts");



///////make a event

router.post('/events',auth,async (req,res)=>{
	let tags = await Tags.find({type:"event"})
	let attempt = {text:req.body.location};
	let options={};
	options.location={}
	options.location.text = req.body.location
	options.title = req.body.title
	options.content = req.body.content
	options.tags = req.body.tags
	options.owner = {
		id:req.user.id,
		name:req.user.displayName
	}
	options.model_type = "user"
	options.date = req.body.date
	options.timeCreated = format('yyyy-MM-ddThh:mm', new Date());
	
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
		let event = options
		if(!event.tags){
			event.tags=[];
		}
		res.status(200).render("createEvent", ({event,user, attempt, tags}))
		return;
	}
	
	options = await new Event(options)
	await options.save()
	res.status(200).redirect(`/events?id=${options._id}`)
	
})


router.get('/events', auth, async (req,res)=>{
	let votes = await Votes.find({$and:[{owner:req.user._id}, {master:req.query.id}]})
	if(votes){
		votes = votes.map(function(v){
			if (v.attach){
				return v.attach.valueOf()
			}
		})
	}
	let scroll = req.query.scroll;
	let event = null;
	if(req.query.id){
		const id = req.query.id;
		try{
			event = await Event.findOne({_id:id});
			
		}
		catch (e) {
			console.log(e)
			res.status(400).send("No post found");
			return;
		}
		
		let user = await req.user.clean();
		let owner = await User.findOne({_id: event.owner.id})
		let ownerAvatar = owner.avatar
		event = event.toObject();
		event.avatar = ownerAvatar
		let edit=false;
		if(owner._id.valueOf() === user._id){
			edit=true
		}
		let comments = await Comment.find({master:event._id})
		
		let cHtml = "";
		cHtml = await Helper.commentLoop(comments, votes, event, "event")
		
		if (!scroll){
			scroll = 0;
		}
		
		let vote= await Votes.findOne({$and:[{owner:user._id},{master:event._id}, {attach:null}]})
		
		if (!vote){
			vote = false;
		}
		else{
			vote = true;
		}
		
		res.status(200).render('viewEvent', ({user,event, edit, cHtml, scroll, vote}))
		
		return
	}
	res.status(200).redirect('/profile')
})


router.get("/events/create", auth, async (req, res)=>{
	let event = null;
	// if (req.query.id){
	// 	event = await Event.findById(req.query.id)
	// }
	let tags = await Tags.find({type:"event"})
	let user = req.user
	user = await user.clean();

	
	res.status(200).render("createEvent", ({user, tags, event}));
	
	})



router.get("/events/edit", auth,async(req, res)=>{
	const id = req.query.id;
	let event = await Event.findOne({_id:id});
	let user = await req.user.clean();
	let tags = await Tags.find({type:"event"})
	
	
	res.status(200).render('createEvent', ({user,event, tags}))
} )


router.post("/events/update", auth, async (req, res)=>{
	let event = await Event.findById(req.body.id)
	let tags = await Tags.find({type:"event"})
	let attempt = {text:req.body.location};
	let options={};
		options._id = event._id
		options.location={}
		options.location.text = req.body.location
		options.title = req.body.title
		options.content = req.body.content
		options.tags = req.body.tags
		options.date = req.body.date
	
	try{
		await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${req.body.location}&key=${process.env.GOOGLE_MAP_API}`)
			.then(response => response.json())
			.then(result => {
				options.location.type= 'Point';
				options.location.coordinates = [result.results[0].geometry.location.lng, result.results[0].geometry.location.lat];
			})
	}
	catch (e) {
		event = options;
		attempt.error = "Could not find location"
		let user = req.user
		user = await user.clean()
		res.status(200).render("createEvent", ({event,user, attempt, tags}))
		return;
	}
	
	 await Event.findOneAndUpdate({_id:req.body.id}, options, {new: true})
	res.status(200).redirect(`/events?id=${event._id}`)
	
	
})


router.get("/events/delete", auth, async (req, res)=>{
	let userId = req.user._id;
	let eventId = req.query.id;
	try{
	const event =	await Event.findOne({$and:[{_id:eventId}, {'owner.id':userId}]})
		await event.cleaner(eventId);
	}
	catch (e) {
		console.log(e)
	}
	res.status(200).redirect("/homepage")
})

module.exports = router;
