const mongoose = require('mongoose')
const validator = require('validator')
const {Mongoose} = require("mongoose");
const Votes = require("../models/votes");
const Comments = require("../models/comment");


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
			type:String,
			required:true
			
		},
		latestComment:{
			type:Date
		},
		commentCount:{
			type:Number,
			default: 0
		} ,
		votes:{
			type: Number,
			default: 0
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

eventSchema.pre('remove', async function (next){
	const event = this;
	let comments = await Comments.find({$and:[{master:event._id}, {attach: null}]})
	if (comments.length > 0){
		for(let c of comments){
			await Comments.findByIdAndRemove(c._id)
		}
	}
	 await Event.findByIdAndRemove(event._id)
	await Votes.deleteMany({master:event._id})
	next();
})



const Event = mongoose.model('Event', eventSchema)

module.exports = Event;
