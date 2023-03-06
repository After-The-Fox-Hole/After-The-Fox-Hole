const mongoose = require('mongoose')
const validator = require('validator')
const {Mongoose} = require("mongoose");



const attendingSchema = new mongoose.Schema({
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
		event: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: 'Event'
		},
	},
	{
		timestamps:true,
		
	});

const escape = (str) => validator.escape(str);

attendingSchema.pre('save', async function(next){
	const attending = this;
	attending.title = escape(attending.title);
	attending.content = escape(attending.content);
	attending.location.text = escape(attending.location.text);
	
	next()
})

const Attending = mongoose.model('Attending', attendingSchema)

module.exports = Attending;
