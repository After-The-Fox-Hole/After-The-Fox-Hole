const mongoose = require('mongoose')
const validator = require('validator')
const {Mongoose} = require("mongoose");




const followingSchema = new mongoose.Schema({
		title: {
			type:String,
			required: true,
		},
		content: {
			type:String,
			required: true,
		},
		tags:[],
		following: { type: [mongoose.Schema.Types.ObjectId], refPath: 'model_type' },
		model_type: {  type: String, enum: ['user','org' ], required: true },
		owner: { type: [mongoose.Schema.Types.ObjectId], ref: 'user' },
	},
	{
		timestamps:true,
		
	});




const Following = mongoose.model('Following', followingSchema)

module.exports = Following;
