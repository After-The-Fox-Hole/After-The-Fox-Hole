const express = require('express')

const router = new express.Router;
const auth = require('../middleware/auth');
const Tags = require("../models/tags")




///////make a event

router.get('/tags',auth,async (req,res)=>{
	let tags = await Tags.find();
	
	
	res.status(200).send(tags);
})




module.exports = router;
