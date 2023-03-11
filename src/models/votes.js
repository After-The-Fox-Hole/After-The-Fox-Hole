const mongoose = require('mongoose')
const {Mongoose} = require("mongoose");




const votesSchema = new mongoose.Schema({
	owner: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
		ref: 'user'
	},
	attach: {
		type: mongoose.Schema.Types.ObjectId,
		required: false,
		ref: 'model_Type'
	},
	model_Type:{  type: String, enum: ['comment'], required: false },
	master: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
		ref: 'model_TypeR'
	},
	model_TypeR:{  type: String, enum: ['post','event'], required: true },
});


const Votes = mongoose.model('Votes', votesSchema)

module.exports = Votes;
