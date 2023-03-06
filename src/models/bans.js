const mongoose = require('mongoose')
const validator = require('validator')
const {Mongoose} = require("mongoose");



const bansSchema = new mongoose.Schema({
	
		owner: {
			required:true,
			type: [mongoose.Schema.Types.ObjectId],
			refPath: 'model_type'
		},
		model_type: {
			type: String,
			enum: ['user','org'],
			required: true
		},
		banCount:{
			type:Number,
		},
		ban:{
			reason:{
				type:String,
				required:true
			},
			date:{}
		}
	},
	{
		timestamps:true,
		
	});

const Bans = mongoose.model('Bans', bansSchema)

module.exports = Bans;
