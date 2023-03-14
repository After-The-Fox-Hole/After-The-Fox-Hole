const mongoose = require('mongoose')
const validator = require('validator')
const {Mongoose} = require("mongoose");
const Comments = require("./comment");
const Votes = require("./votes");





const postSchema = new mongoose.Schema({
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
	model_type: {  type: String, enum: ['user','org' ], required: true },
	timeCreated: {type: Date, default: Date.now },
	votes:{
		type: Number,
		default: 0
	},
	latestComment:{
		type:Date
	},
	commentCount:{
		type:Number,
		default: 0
	} ,
	},
	
	{
		timestamps:true,
	});

postSchema.virtual("comments", {
	ref: "Comment",
	localField: "_id",
	foreignField: "master"
})

postSchema.virtual("reports", {
	ref: "Reports",
	localField: "_id",
	foreignField: "type"
})

const escape = (str) => validator.escape(str);

postSchema.pre('save', async function(next){
	const post = this;
	post.title = escape(post.title);
	post.content = escape(post.content);
	
	next()
})



postSchema.methods.toJSON = function (){
	const user = this;
	return user.toObject();
}


const Post = mongoose.model('Post', postSchema)

module.exports = Post;
