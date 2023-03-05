const mongoose = require('mongoose')
const validator = require('validator')
const {Mongoose} = require("mongoose");
const bcrypt = require("bcryptjs");
const es = require("validator/es");



const eventSchema = new mongoose.Schema({
		title: {
			type:String,
			required: true,
		},
		content: {
			type:String,
			required: true,
		},
		tags:[],
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
		location: {
			text:{
				type:String,
				required:true
			},
			type: {
				type: String,
				enum: ['Point', "online"],
				required: true
			},
			coordinates: {
				type: [Number],
				required: false
			}
		},
	},
	{
		timestamps:true,
		
	});

const escape = (str) => validator.escape(str);

eventSchema.pre('save', async function(next){
	const event = this;
	event.title = escape(event.title);
	event.content = escape(event.content);
	event.location.text = escape(event.location.text);
	
	next()
})

const Post = mongoose.model('Post', postSchema)

module.exports = Post;
