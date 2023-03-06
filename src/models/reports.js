const mongoose = require('mongoose')
const validator = require('validator')
const {Mongoose} = require("mongoose");



const reportsSchema = new mongoose.Schema({
		content:{
			required:true,
			type:String,
		},
		owner: {
			required:true,
			type: [mongoose.Schema.Types.ObjectId],
			refPath: 'model_type'
		},
		model_type: {
			type: String,
			enum: ['user','org'],
			required: true
		},
		type: {
			required:true,
			type: [mongoose.Schema.Types.ObjectId],
			refPath: 'model_typeR'
		},
		model_typeR: {
			type: String,
			enum: ['user','org', 'post', 'event', 'feedback'],
			required: true
		},
		status:{
			type: String,
			enum:['open', 'closed', 'in review']
		}
	},
	{
		timestamps:true,
		
	});


const escape = (str) => validator.escape(str);

reportsSchema.pre('save', async function(next){
	const reports = this;
	reports.content = escape(reports.content);
	
	next()
})

const Reports = mongoose.model('Reports', reportsSchema)

module.exports = Reports;
