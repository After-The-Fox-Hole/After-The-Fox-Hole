const mongoose = require('mongoose')
const validator = require('validator')
const {Mongoose} = require("mongoose");



const feedbackSchema = new mongoose.Schema({
	
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
		rating:{
			type:Number,
			required:true
		}
	},
	{
		timestamps:true,
		
	});

feedbackSchema.virtual("reports", {
	ref: "Reports",
	localField: "_id",
	foreignField: "type"
})


const escape = (str) => validator.escape(str);

feedbackSchema.pre('save', async function(next){
	const feedback = this;
	feedback.content = escape(feedback.content);
	
	
	next()
})

const Feedback = mongoose.model('Feedback', feedbackSchema)

module.exports = Feedback;
