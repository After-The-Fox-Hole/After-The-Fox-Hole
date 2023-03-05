	const mongoose = require('mongoose')
	const validator = require('validator')
	const {Mongoose} = require("mongoose");
	const bcrypt = require('bcryptjs');
	const jwt = require('jsonwebtoken')
	
	
	const userSchema = new mongoose.Schema({
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
			service: {
				branch: {
					type: String,
					required: true,
					trim: true,
					lowercase: true,
				},
				status: {
					type: String,
					required: true,
					enum:["active", "veteran", "reserve"],
					trim: true,
				}
			},
			currentJob:{
				type: String,
				required: false,
				trim: true,
				lowercase: true,
			},
			name:{
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
				gender:{
					type: String,
					enum:["male", "female","trans-f", "trans-m", "non-binary"],
					required: true,
					trim: true,
				}
			}
		},
		displayName:{
			type: String,
			unique: true,
			required: true,
			trim: true,
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
		admin:{
			type: Boolean,
			required: true,
			default: false
		},
		eeMember:{
			type: Boolean,
			required: true,
			default: false
		},
		tags:[],
		status:{
			type: String,
			enum:["active", "suspended", "recovery"],
			default: "active",
		},
		avatar:{
			type: Buffer
		},
		type:{
			type:String,
			default: "user"
		},
		recovery:{
			type: String,
			trim: true
		}
	},
	{
		timestamps:true,
		
	});
	
	// userSchema.methods.toJSON = function (){
	// 	const user = this;
	// 	const userObj = user.toObject();
	//
	// 	delete userObj.password;
	// 	delete userObj.tokens;
	//
	// 	return userObj;
	// }
	
	userSchema.methods.generateAuthToken = async function(){
		const user = this;
		const token = jwt.sign({_id: user.id.toString()}, process.env.JWT_SECRET)
		user.tokens = user.tokens.concat({token});
		await user.save();
		
		return token;
	}
	
	userSchema.statics.findByCredentials = async (email, password) =>{
		const user = await User.findOne({"info.email":email})
		if (!user){
			throw new Error("Account does not exist")
		}
		if(user.status !== "suspended"){
			const isMatch = await bcrypt.compare(password, user.password)
			
			if (!isMatch){
				if (user.status !== "recovery"){
					throw new Error("User name or password incorrect")
				}
			}
			else{
				return user
			}
			if(user.status === "recovery"){
				const isMatch = await bcrypt.compare(password, user.recovery)
				
				if (!isMatch){
					throw new Error("User name or password incorrect")
				}
				return user
			}
		}
		throw new Error("Your account is suspended");
	}
	
	
	//// hasher
	// userSchema.pre('save', async function(next){
	// const user = this;
	//
	// if(user.isModified('password')){
	// 	user.password = await bcrypt.hash(user.password, 8)
	// }
	// next()
	// })
	
	
	const User = mongoose.model('User', userSchema)
	
	module.exports = User;
