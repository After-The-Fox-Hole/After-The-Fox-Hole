const mongoose = require('mongoose')
const validator = require('validator')
const {Mongoose} = require("mongoose");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')


const orgSchema = new mongoose.Schema({
		info: {
			email: {
				type: String,
				unique: true,
				required: true,
				trim: true,
				lowercase: true,
				validate(value) {
					if (!validator.isEmail(value)) {
						throw new Error("email invalid")
					}
				}
			},
			location: {
				type: {
					type: String, // Don't do `{ location: { type: String } }`
					enum: ['Point'], // 'location.type' must be 'Point'
					required: true
				},
				coordinates: {
					type: [Number],
					required: true
				}
			},
			name:{
				org:{
					type: String,
					unique: true,
					required: true,
					trim: true,
					lowercase: true,
				},
				first:{
					type: String,
					required: true,
					trim: true,
					lowercase: true,
				},
				last:{
					type: String,
					required: true,
					trim: true,
					lowercase: true,
				},
			},
			status: {
				type: String,
				required: true,
				enum:["Volunteer", "Non-Profit", "For Profit"],
				trim: true,
			},
		},
		password: {
			type: String,
			required: true,
			trim: true,
			validate(value){
				if (value.length < 6){
					throw new Error("password to short")
				}
				if (value.toLowerCase().includes("password")){
					throw new Error("password contains password")
				}
			}
		},
		tokens: [{
			token:{
				type: String,
				required: true
			}
		}],
		eeMember:{
			type: Boolean,
			required: true,
			default: false
		},
		tags:[],
		status:{
			type: String,
			enum:["active", "suspended"],
			required: false
		},
		type:{
			type:String,
			default: "org"
		},
		avatar:{
			type: Buffer
		},
	},
	{
		timestamps:true,
		
	});

// orgSchema.methods.toJSON = function (){
// 	const user = this;
// 	const userObj = user.toObject();
//
// 	delete userObj.password;
// 	delete userObj.tokens;
//
// 	return userObj;
// }

orgSchema.methods.generateAuthToken = async function(){
	const org = this;
	const token = jwt.sign({_id: org.id.toString()}, process.env.JWT_SECRET)
	org.tokens = org.tokens.concat({token});
	await org.save();
	
	return token;
}

orgSchema.statics.findByCredentials = async (email, password) =>{
	const org = await Org.findOne({"info.email":email})
	
	if (!org){
		throw new Error("Unable to login")
	}
	
	const isMatch = await bcrypt.compare(password, org.password)
	
	if (!isMatch){
		throw new Error("unable to login")
	}
	return org
}

//// hasher
orgSchema.pre('save', async function(next){
	const org = this;
	
	if(org.isModified('password')){
		org.password = await bcrypt.hash(org.password, 8)
	}
	
	next()
})


const Org = mongoose.model('Org', orgSchema)

module.exports = Org;
