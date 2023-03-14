const mongoose = require('mongoose')
const validator = require('validator')
const {Mongoose} = require("mongoose");
const Events = require("../models/event");
const Posts = require("../models/posts");
const Votes = require("../models/votes");



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
			refPath: 'comment',
			default: null
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

commentSchema.pre("remove", async function (next) {
	const comment = this;
	let replies = await Comment.find({attach: comment._id})
	if (replies.length > 0) {
			for (let c of replies) {
				if (c.model_typeM === "event") {
					await Events.findByIdAndUpdate(c.master, {$inc: {commentCount: -1}})
				} else {
					await Posts.findByIdAndUpdate(c.master, {$inc: {commentCount: -1}})
				}
				await Comment.findByIdAndRemove(c._id);
			}
	}
	if (comment.model_typeM === "event") {
		await Events.findByIdAndUpdate(comment.master, {$inc: {commentCount: -1}})
	} else {
		await Posts.findByIdAndUpdate(comment.master, {$inc: {commentCount: -1}})
	}
	await Votes.deleteMany({attach:comment._id})
	await Comment.findByIdAndRemove(comment._id)
	next();
	
	// await Comment.findByIdAndUpdate(attach,{$inc:{votes:value}} )
})

const Comment = mongoose.model('Comment', commentSchema)

module.exports = Comment;
