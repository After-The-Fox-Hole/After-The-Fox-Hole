const mongoose = require('mongoose')
const validator = require('validator')
const {Mongoose} = require("mongoose");



const eeSchema = new mongoose.Schema({
	owner: { type: [mongoose.Schema.Types.ObjectId], refPath: 'model_type' },
	model_type: {  type: String, enum: ['user','org' ], required: true },
	condition:{
		text:{
			type: Boolean,
			required: true,
		},
		call:{
			type: Boolean,
			required: true,
		},
		email:{
			type: Boolean,
			required: true,
		}
	},
	availability:[],
	info:{
		age:{
			type:Number,
			required: true,
		},
		number:{
			type: String,
			required: true
		}
	}
	});

const escape = (str) => validator.escape(str);

//// hasher
eeSchema.pre('save', async function(next){
	const ee = this;
	ee.info.number = escape(ee.info.number);
	next()
})


const Ee = mongoose.model('ee', eeSchema)

module.exports = Ee;
