const express = require('express')
const User = require("../models/user");
const router = new express.Router;
const auth = require('../middleware/auth');
const app = require("../app");
const Event = require("../models/event");




///////make a event

router.get('/homepage',auth,async (req,res)=>{

})




module.exports = router;
