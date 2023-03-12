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
		attach: {
			type: [mongoose.Schema.Types.ObjectId],
			refPath: 'comment'
		},
		master:{
			required:true,
			type: [mongoose.Schema.Types.ObjectId],
			refPath: 'model_typeM'
		},
		model_typeM: {
			type: String,
			enum: ['post','event'],
			required: true
		},
		timeCreated: {type: Date},
	},
	{
		timestamps:true,
		
	});

commentSchema.virtual("comment", {
	ref: "Comment",
	localField: "_id",
	foreignField: "attach"
})

commentSchema.virtual("reports", {
	ref: "Reports",
	localField: "_id",
	foreignField: "type"
})


const escape = (str) => validator.escape(str);

commentSchema.pre('save', async function(next){
	const comment = this;
	comment.content = escape(comment.content);
	
	
	next()
})

const Comment = mongoose.model('Comment', commentSchema)

module.exports = Comment;
