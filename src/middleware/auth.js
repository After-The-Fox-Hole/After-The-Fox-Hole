	const jwt = require('jsonwebtoken')
	const User = require('../models/user')
	const Org = require('../models/org')
	const Attending = require("../models/attending");
	const Events = require("../models/event");

	const auth = async (req, res, next)=>{
		try {
			
			const token = req.cookies.access_token;
			const decoded = jwt.verify(token, process.env.JWT_SECRET)
			let user = await User.findOne({ _id:decoded._id, 'tokens.token':token })
			
			if(!user){
				user = await Org.findOne({ _id:decoded._id, 'tokens.token':token })
			}
			if(!user){
				res.status(200).render('index');
				return
			}
			req.token = token;
			
			let upcoming =await Attending.find({'owner.id': user._id})
			let events = [];
			for (let e of upcoming){
				let y;
				y = await Events.findOne({_id:e.event._id})
				events.push(y)
			}
			
			
			req.events = events
			req.user = user
			
			next();
		}
		catch (e){
			res.status(200).render('index');
		}
	}
	
	module.exports = auth;
