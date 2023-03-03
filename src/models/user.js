	const mongoose = require('mongoose')
	const validator = require('validator')
	const {Mongoose} = require("mongoose");
	const bcrypt = require('bcryptjs');
	const jwt = require('jsonwebtoken')
	
	
	const userSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		trim: true
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
	email:{
		type: String,
		unique: true,
		required: true,
		trim: true,
		lowercase: true,
		validate(value) {
			if (!validator.isEmail(value)){
				throw new Error("email invalid")
			}
		}
	},
	
	tokens: [{
			token:{
				type: String,
				required: true
			}
		}],
		
	isAdmin: {
		type: Boolean,
		default: false,
		
	}
	
	},
	
{
		timestamps:true,
	});
	
	userSchema.methods.toJSON = function (){
		const user = this;
		const userObj = user.toObject();
		
		delete userObj.password;
		delete userObj.tokens;
		
		return userObj;
	}
	
	userSchema.methods.generateAuthToken = async function(){
		const user = this;
		const token = jwt.sign({_id: user.id.toString()}, process.env.JWT_SECRET)
		user.tokens = [];
		user.tokens.push({token})
		await user.save();
		
		return token;
	}
	
	userSchema.statics.findByCredentials = async (email, password) =>{
		const user = await User.findOne({email})
		
		if (!user){
			throw new Error("Unable to login")
		}
		
		const isMatch = await bcrypt.compare(password, user.password)
	
	if (!isMatch){
		throw new Error("unable to login")
	}
	
	return user
	}
	
	//// hasher
	userSchema.pre('save', async function(next){
	const user = this;
	
	if(user.isModified('password')){
		user.password = await bcrypt.hash(user.password, 8)
	}
	
	next()
	})
	
	
	const User = mongoose.model('User', userSchema)
	
	module.exports = User;
