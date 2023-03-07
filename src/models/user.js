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
				text:{
					type:String,
					required:true
				},
				type: {
					type: String,
					enum: ['Point', "online"],
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
		},
		favTags:[]
	},
	{
		timestamps:true,
		
	});
	
	userSchema.virtual("posts", {
		ref: "Post",
		localField: "_id",
		foreignField: "owner"
	})
	
	userSchema.virtual("event", {
		ref: "Event",
		localField: "_id",
		foreignField: "owner"
	})
	
	userSchema.virtual("attending", {
		ref: "Attending",
		localField: "_id",
		foreignField: "owner"
	})
	
	userSchema.virtual("comment", {
		ref: "Comment",
		localField: "_id",
		foreignField: "owner"
	})
	
	userSchema.virtual("rating", {
		ref: "Rating",
		localField: "_id",
		foreignField: "owner"
	})
	
	userSchema.virtual("ee", {
		ref: "Ee",
		localField: "_id",
		foreignField: "owner"
	})
	
	userSchema.virtual("feedback", {
		ref: "Feedback",
		localField: "_id",
		foreignField: "owner"
	})
	
	userSchema.virtual("reports", {
		ref: "Reports",
		localField: "_id",
		foreignField: "owner"
	})
	
	userSchema.virtual("reports", {
		ref: "Reports",
		localField: "_id",
		foreignField: "type"
	})
	
	userSchema.virtual("bans", {
		ref: "Bans",
		localField: "_id",
		foreignField: "owner"
	})
	
	userSchema.virtual("following", {
		ref: "Following",
		localField: "_id",
		foreignField: "owner"
	})
	
	userSchema.virtual("following", {
		ref: "Following",
		localField: "_id",
		foreignField: "following"
	})
	
	
	userSchema.methods.toJSON = function (){
		const user = this;
		const userObj = user.toObject();

		
		delete userObj.status;
		delete userObj.password;
		delete userObj.recovery;
		delete userObj.tokens;

		return userObj;
	}
	
	userSchema.methods.clean = function (){
		const user = this;
		let userObj = user.toObject();
		userObj._id = userObj._id.valueOf();
		delete userObj.info;
		delete userObj.status;
		delete userObj.password;
		delete userObj.recovery;
		delete userObj.tokens;
		
		return userObj;
	}
	
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
	
	
	const escape = (str) => validator.escape(str);
	
	//// hasher
	userSchema.pre('save', async function(next){
	const user = this;
	user.displayName = 	escape(user.displayName);
	user.info.email = escape(user.info.email);
	user.info.currentJob = escape(user.info.currentJob);
	user.info.name.first = escape(user.info.name.first);
	user.info.name.last = escape(user.info.name.last);
	user.info.location.text = escape(user.info.location.text);
	
	if(user.isModified('password')){
		user.password = await bcrypt.hash(user.password, 8)
	}
	next()
	})
	
	
	const User = mongoose.model('User', userSchema)
	
	module.exports = User;
