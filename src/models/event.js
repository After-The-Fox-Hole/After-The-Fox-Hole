const mongoose = require('mongoose')
const validator = require('validator')
const {Mongoose} = require("mongoose");



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
		timeCreated: {type: Date, default: Date.now },
		date:{
			type:Date,
			required:true
		}
	},
	{
		timestamps:true,
		
	});


eventSchema.virtual("attending", {
	ref: "Attending",
	localField: "_id",
	foreignField: "event"
})

eventSchema.virtual("comment", {
	ref: "Comment",
	localField: "_id",
	foreignField: "attach"
})

eventSchema.virtual("reports", {
	ref: "Reports",
	localField: "_id",
	foreignField: "type"
})

const escape = (str) => validator.escape(str);

eventSchema.pre('save', async function(next){
	const event = this;
	event.title = escape(event.title);
	event.content = escape(event.content);
	event.location.text = escape(event.location.text);
	
	next()
})

const Event = mongoose.model('Event', eventSchema)

module.exports = Event;
