const mongoose = require('mongoose')
const validator = require('validator')
const {Mongoose} = require("mongoose");




const followingSchema = new mongoose.Schema({
		following: {
			id:{
				required:true,
				type: [mongoose.Schema.Types.ObjectId],
				refPath: 'user'
			},
			name:{
				type:String,
				required: true
			}},
		owner: { type: [mongoose.Schema.Types.ObjectId], ref: 'user' },
	},
	{
		timestamps:true,
		
	});




const Following = mongoose.model('Following', followingSchema)

module.exports = Following;
