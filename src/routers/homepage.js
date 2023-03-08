const express = require('express')
const User = require("../models/user");
const router = new express.Router;
const auth = require('../middleware/auth');
const app = require("../app");
const Event = require("../models/event");




///////make a event

router.get('/homepage',auth,async (req,res)=>{

	
	let user = req.user
	user = user.clean();
	res.status(200).render("homepage", user, tags)
	
})

router.get('/homepage/info', auth, async (req, res) =>{
	let obj = {}
	let type = req.query.type;
	let tag = req.query.tag;
	let sort = req.query.sort;
	let tab = req.query.tab;
	
	
	
	
	
	res.status(200).send()
})




module.exports = router;
