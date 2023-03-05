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
				text:{
					type:String,
					required:true
				},
				type: {
					type: String,
					enum: ['Point'],
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
			enum:["active", "suspended", "recovery"],
			default: "suspended",
		},
		type:{
			type:String,
			default: "org"
		},
		avatar:{
			type: Buffer
		},
		recovery:{
			type: String,
			trim: true
		}
	},
	{
		timestamps:true,
		
	});

orgSchema.virtual("posts", {
	ref: "Post",
	localField: "_id",
	foreignField: "owner"
})

orgSchema.virtual("event", {
	ref: "Event",
	localField: "_id",
	foreignField: "owner"
})

orgSchema.virtual("attending", {
	ref: "Attending",
	localField: "_id",
	foreignField: "owner"
})


orgSchema.methods.toJSON = function (){
	const org = this;
	const orgObj = org.toObject();
	
	
	delete orgObj.status;
	delete orgObj.password;
	delete orgObj.recovery;
	delete orgObj.tokens;
	
	return orgObj;
}

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
		throw new Error("Account does not exist")
	}
	if(org.status !== "suspended"){
		const isMatch = await bcrypt.compare(password, org.password)
		
		if (!isMatch){
			if (org.status !== "recovery"){
				throw new Error("org name or password incorrect")
			}
		}
		else{
			return org
		}
		if(org.status === "recovery"){
			const isMatch = await bcrypt.compare(password, org.recovery)
			
			if (!isMatch){
				throw new Error("org name or password incorrect")
			}
			return org
		}
	}
	throw new Error("Your account is suspended");
}

const escape = (str) => validator.escape(str);


//// hasher
orgSchema.pre('save', async function(next){
	const org = this;
	org.displayName = 	escape(org.displayName);
	org.info.email = escape(org.info.email);
	org.info.name.org = escape(org.info.name.org);
	org.info.name.first = escape(org.info.name.first);
	org.info.name.last = escape(org.info.name.last);
	org.info.localField.text = escape(org.info.localField.text)
	if(org.isModified('password')){
		org.password = await bcrypt.hash(org.password, 8)
	}
	
	next()
})


const Org = mongoose.model('Org', orgSchema)

module.exports = Org;
