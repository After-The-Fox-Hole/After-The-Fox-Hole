	const jwt = require('jsonwebtoken')
	const User = require('../models/user')
	const Org = require('../models/org')

	const auth = async (req, res, next)=>{
		try {
			
			const token = req.cookies.access_token;
			const decoded = jwt.verify(token, process.env.JWT_SECRET)
			let user = await User.findOne({ _id:decoded._id, 'tokens.token':token })
			
			if(!user){
				user = await Org.findOne({ _id:decoded._id, 'tokens.token':token })
			}
			if(!user){
				throw Error();
			}
			req.token = token;
			req.user = user;
			next();
		}
		catch (e){
			res.status(200).render('index');
		}
	}
	
	module.exports = auth;
