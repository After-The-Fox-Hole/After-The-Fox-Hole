const mongoose = require('mongoose')
const validator = require('validator')
const {Mongoose} = require("mongoose");




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
	owner: { type: [mongoose.Schema.Types.ObjectId], refPath: 'model_type' },
	model_type: {  type: String, enum: ['user','org' ], required: true },
	
	},
	{
		timestamps:true,
		
	});

postSchema.virtual("comment", {
	ref: "Comment",
	localField: "_id",
	foreignField: "attach"
})


const escape = (str) => validator.escape(str);

postSchema.pre('save', async function(next){
	const post = this;
	post.title = escape(post.title);
	post.content = escape(post.content);
	
	next()
})

const Post = mongoose.model('Post', postSchema)

module.exports = Post;
