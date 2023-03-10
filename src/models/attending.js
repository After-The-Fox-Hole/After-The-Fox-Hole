const mongoose = require('mongoose')
const validator = require('validator')
const {Mongoose} = require("mongoose");



const attendingSchema = new mongoose.Schema({
		owner: {
			id:{
				required:true,
				type: [mongoose.Schema.Types.ObjectId],
				refPath: 'model_type'
			},
			name:{
				type:String,
				required: true
			}
			
		},
		model_type: {
			type: String,
			enum: ['user','org'],
			required: true
		},
		event: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: 'Event'
		},
	},
	{
		timestamps:true,
		
	});



const Attending = mongoose.model('Attending', attendingSchema)

module.exports = Attending;
