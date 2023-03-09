
const User = require('../models/user')
const Org = require('../models/org')
const Attending = require('../models/attending')
const Events = require('../models/event')

const attending = async (req, res, next)=>{
	let user = req.user;
	let upcoming =await Attending.find({'owner._id': user._id})
	let events = [];
	for (let e of upcoming){
		let y;
		y = await Events.findOne({_id:e.event._id})
		events.push(y)
	}
	user.events = events
	req.user = user
	
	console.log(user)
	next();
}

module.exports = attending;
