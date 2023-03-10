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
				res.status(200).render('login');
				return
			}
			req.token = token;
			
			
			req.user = user
			
			next();
		}
		catch (e){
			res.status(200).render('login');
		}
	}
	
	module.exports = auth;
