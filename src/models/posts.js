const mongoose = require('mongoose')
const validator = require('validator')
const {Mongoose} = require("mongoose");



const postSchema = new mongoose.Schema({
	info: {
	
	},
	
	
	},
	{
		timestamps:true,
		
	});

const Post = mongoose.model('Post', userSchema)

module.exports = Post;
