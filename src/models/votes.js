const mongoose = require('mongoose')
const {Mongoose} = require("mongoose");




const votesSchema = new mongoose.Schema({
	owner: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
		ref: 'user'
	},
	value:{
		type:Number,
		enum: [-1, 1],
		required:true
	},
	attach: {
		type: mongoose.Schema.Types.ObjectId,
		required: false,
		ref: 'comment'
	},
	master: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
		ref: 'model_TypeR'
	},
	model_TypeR:{  type: String, enum: ['post','event'], required: true },
});


const Votes = mongoose.model('Votes', votesSchema)

module.exports = Votes;
