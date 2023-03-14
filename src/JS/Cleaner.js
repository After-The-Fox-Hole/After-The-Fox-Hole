const Posts = require("../models/posts");
const Events = require("../models/event");
const Comments = require("../models/comment");
const Votes = require("../models/votes");
const mongoose = require('mongoose')
const {Mongoose} = require("mongoose");
const Post = require("../models/posts");

const clean = {};

// userSchema.statics.cleaner= async function(id){
// 	const user = await User.findById(id);
// 	await Posts.deleteMany({'owner.id':user._id})
// 	await Events.deleteMany({'owner.id':user._id})
// 	await Comments.deleteMany({'owner.id':user._id})
// 	await User.findByIdAndRemove(user._id)
//
// }

clean.postCascade = async function(post){
	console.log(post._id)
	let comments = await Comments.find({$and:[{'master.id':post._id}, {attach: null}]})
	console.log(comments)
	// if (comments.length > 0){
	// 	for(let c of comments){
	// 		await Comments.findByIdAndRemove(c._id)
	// 	}
	// }
	//
	// await Votes.deleteMany({master:id})
	// await Post.findByIdAndRemove(id)
}

// eventSchema.statics.cleaner= async function(id){
// 	const event = await Event.findById(id);
// 	let comments = await Comments.find({$and:[{master:event._id}, {attach: null}]})
// 	if (comments.length > 0){
// 		for(let c of comments){
// 			await Comments.findByIdAndRemove(c._id)
// 		}
// 	}
//
// 	await Votes.deleteMany({master:event._id})
// 	await Event.findByIdAndRemove(event._id)
// }

// commentSchema.statics.cleaner= async function(id){
// 	const comment = await Comment.findById(id);
// 	let replies = await Comment.find({attach: comment._id})
// 	if (replies.length > 0) {
// 		for (let c of replies) {
// 			if (c.model_typeM === "event") {
// 				await Events.findByIdAndUpdate(c.master, {$inc: {commentCount: -1}})
// 			} else {
// 				await Posts.findByIdAndUpdate(c.master, {$inc: {commentCount: -1}})
// 			}
// 			await Comment.findByIdAndRemove(c._id);
// 		}
// 	}
// 	if (comment.model_typeM === "event") {
// 		await Events.findByIdAndUpdate(comment.master, {$inc: {commentCount: -1}})
// 	} else {
// 		await Posts.findByIdAndUpdate(comment.master, {$inc: {commentCount: -1}})
// 	}
// 	await Votes.deleteMany({attach:comment._id})
// 	await Comment.findByIdAndRemove(comment._id)
//
//
// 	// await Comment.findByIdAndUpdate(attach,{$inc:{votes:value}} )
// }



















module.exports = clean;
