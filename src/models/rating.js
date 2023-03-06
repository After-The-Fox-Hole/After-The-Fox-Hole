const mongoose = require('mongoose')
const validator = require('validator')
const {Mongoose} = require("mongoose");




const ratingSchema = new mongoose.Schema({
		content: {
			type:String,
			required: true,
		},
		owner: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: 'user'
		},
		org:{
				type: mongoose.Schema.Types.ObjectId,
				required: true,
				ref: 'org'
			},
		rating:{
			required: true,
			type: Number,
		}
		
	},
	{
		timestamps:true,
		
	});

ratingSchema.virtual("comment", {
	ref: "Comment",
	localField: "_id",
	foreignField: "attach"
})


const escape = (str) => validator.escape(str);

ratingSchema.pre('save', async function(next){
	const rating = this;
	rating.content = escape(rating.content);
	
	next()
})

const Rating = mongoose.model('Rating', ratingSchema)

module.exports = Rating;
