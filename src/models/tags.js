const mongoose = require('mongoose')
const {Mongoose} = require("mongoose");




const tagsSchema = new mongoose.Schema({
		content: {
			type:String,
			required: true,
		},
		type:{
			type:String,
			required: true,
		}
	});


const Tags = mongoose.model('tags', tagsSchema)

module.exports = Tags;
