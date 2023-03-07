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
		enum:["post", "user", "event"]
	}
});


const Tags = mongoose.model('Tags', tagsSchema)

module.exports = Tags;
