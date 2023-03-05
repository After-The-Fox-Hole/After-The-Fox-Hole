const mongoose = require('mongoose')
const validator = require('validator')
const {Mongoose} = require("mongoose");



const commentSchema = new mongoose.Schema({
	
		votes:{
			type:Number,
			default:0,
		},
		content:{
			required:true,
			type:String,
		},
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
		attach: {
			required:true,
			type: [mongoose.Schema.Types.ObjectId],
			refPath: 'model_typeR'
		},
		model_typeR: {
			type: String,
			enum: ['post','event', 'comment'],
			required: true
		},
	},
	{
		timestamps:true,
		
	});

commentSchema.virtual("comment", {
	ref: "Comment",
	localField: "_id",
	foreignField: "attach"
})


const escape = (str) => validator.escape(str);

commentSchema.pre('save', async function(next){
	const comment = this;
	comment.content = escape(comment.content);
	
	
	next()
})

const Comment = mongoose.model('Comment', commentSchema)

module.exports = Comment;
