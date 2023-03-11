const express = require('express')
const User = require("../models/user");
const router = new express.Router;
const auth = require('../middleware/auth');
const app = require("../app");
const Event = require("../models/event");
const Tags = require("../models/tags")




///////make a event

router.get('/tags',auth,async (req,res)=>{
	let tags = await Tags.find();
	
	
	res.status(200).send(tags);
})




module.exports = router;
