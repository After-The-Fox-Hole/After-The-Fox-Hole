const Posts = require("../models/posts");
const Events = require("../models/event");
const Comments = require("../models/comment");
const Votes = require("../models/votes");
const mongoose = require('mongoose')
const {Mongoose} = require("mongoose");
const Users = require("../models/user");
const Attending = require("../models/attending");
const Fireteam = require("../models/following");

const clean = {};

clean.userCascade = async function(user){
	
	const posts = await Posts.find({'owner.id':user._id})
	
	if(posts && posts.length > 0){
		for(let p of posts){
			await clean.postingCascade(p, "post")
		}
	}
	
	const events = await Events.find({'owner.id':user._id})
	
	if(events && events.length > 0){
		for(let e of events){
			await clean.postingCascade(e, "event")
		}
	}
	
	const comment = await Comments.find({"owner.id":user._id})
	if (comment && comment.length > 0){
		for (let c of comment){
			await clean.commentCascade(c);
		}
	}
	const votes = await Votes.find({owner:user._id})
	if(votes && votes.length > 0){
		for (let v of votes){
			if(v.attach !== null){
				
				await Comments.findByIdAndUpdate(v.attach._id, {$inc: {votes: -1}})
			}
			else{
				if(v.model_TypeR === "post"){
					
					await Posts.findByIdAndUpdate(v.master._id, {$inc: {votes: -1}})
				}
				else{
					
					await Events.findByIdAndUpdate(v.master._id, {$inc: {votes: -1}})
				}
			}
			
			await v.deleteOne();
		}
	}
	
	await Attending.deleteMany({'owner.id': user._id});
	await Fireteam.deleteMany({$or:[{owner:user._id}, {"following.id":user._id}]});
	await user.deleteOne();
	
}

clean.postingCascade = async function(posting, type){
	await Comments.deleteMany({master:posting._id})
	await Votes.deleteMany({master:posting._id})
	
		await posting.deleteOne();
	if(type === "event"){
		await Attending.deleteMany({event:posting._id})
	}
	
}

clean.commentCascade = async function(c){
			if (c.model_typeM === "event") {
				
				await Events.findByIdAndUpdate(c.master._id, {$inc: {commentCount: -1}})
			} else {
				
				await Posts.findByIdAndUpdate(c.master._id, {$inc: {commentCount: -1}})
			}
			await c.deleteOne();
			await Votes.deleteMany({attach:c._id})
		}
	


module.exports = clean;
