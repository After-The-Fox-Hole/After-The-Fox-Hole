const mongoose = require('mongoose')
const validator = require('validator')
const {Mongoose} = require("mongoose");



const avatarsSchema = new mongoose.Schema({
		image:{
			type: String,
		}
	},
	{
		timestamps:true,
		
	});

const Avatars = mongoose.model('Avatars', avatarsSchema)

module.exports = Avatars;
