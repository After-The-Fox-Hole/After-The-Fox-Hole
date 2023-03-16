const express = require('express')
const User = require("../models/user");
const router = new express.Router;
const auth = require('../middleware/auth');
const Post = require("../models/posts");
const Cascade = require("../JS/Cleaner")



///////sign up

router.post('/users',async (req,res)=>{
	
	
	let address = req.body.location
	let user = {
		info:{
			location:{
				text: address
			},
			currentJob: req.body.currentJob,
			name:{
				first: req.body.firstN,
				last: req.body.last
			},
			email:req.body.email,
			service:{
				branch: req.body.branch,
				status: req.body.status
			}
		},
		displayName: req.body.displayName,
		password: req.body.password
	}
	
	let requestOptions = {
		method: 'GET',
		redirect: 'follow'
	};
	try{
		await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${process.env.GOOGLE_MAP_API}`, requestOptions)
			.then(response => response.json())
			.then(result => {
				user.info.location.type= 'Point';
				user.info.location.coordinates = [result.results[0].geometry.location.lng, result.results[0].geometry.location.lat];
			})
	}
	catch (e) {
		let error={
			error:"Location could not be found"
		}
		let attempt = user;
		res.status(200).render("registerUser", ({attempt,error}));
		return;
	}
	try{
		user = new User(user);
		await user.save();
		const token = await user.generateAuthToken()
		
		res.cookie("access_token", token, {httpOnly: true});
		res.status(200).redirect(`/profile?id=${user._id}`);
	}
	catch (e){
		let error={
			error:"Email already exists"
		}
		let attempt = user
		user.password = req.body.password
		res.status(200).render("registerUser", ({attempt,error}));
		return;
	}
})



//////// log out

router.get('/users/logout', auth, async (req, res)=>{
	try{
		req.user.tokens = req.user.tokens.filter((token)=>{
			return token.token !== req.token
		})
		await req.user.save();
		res.status(200).render("login");
	}
	catch (e){
		res.status(500).send();
	}
})

router.post('/users/logoutAll', auth, async (req, res)=>{
	try{
		req.user.tokens = [];
		await req.user.save();
		res.send();
	}
	catch (e){
		res.status(500).send();
	}
});

router.delete('/users/me',auth, async (req, res)=>{
	try {
		await req.user.remove();
		res.send(req.user)
	}
	catch (e){
		res.status(500).send(e)
	}
})


router.post("/users/recovery", async (req, res)=>{
	let email = req.body.email;
	try{
		let user = await User.findOne({'info.email':email})
		if(user){
			let chars = "0123456789abcdefghijklmnopqrstuvwxyz!@#$%^&*()ABCDEFGHIJKLMNOPQRSTUVWXYZ";
			let passwordLength = 12;
			let password = "";
			
			for (let i = 0; i <= passwordLength; i++) {
				let randomNumber = Math.floor(Math.random() * chars.length);
				password += chars.substring(randomNumber, randomNumber +1);
			}
			user.password = password;
			await user.save();
			
			const sgMail = require('@sendgrid/mail')
			sgMail.setApiKey(process.env.SENDGRID_API_KEY)
			const msg = {
				to: `${email}`, // Change to your recipient
				from: 'informational@afterthefoxhole.com', // Change to your verified sender
				subject: 'After The Fox Hole RECOVERY',
				text: `Your new password is:    ${password}   REMEMBER TO CHANGE YOUR PASSWORD IN EDIT PROFILE`,
				html: `<div>Your NEW password is:   <strong>${password}</strong> </div>
				<div>REMEMBER TO CHANGE YOUR PASSWORD IN EDIT PROFILE</div>`,
			}
			sgMail
				.send(msg)
				.then(() => {
					console.log('Email sent')
				})
				.catch((error) => {
					console.error(error)
				})
		}
		
	}
	catch (e) {
	console.log(e)
	}
	let attempt = {
		status: "If The Account exists, an email was sent!"
	}
	res.render('login', ({attempt}))
})

router.get("/users/delete", auth, async (req, res)=>{
	
	try{
		await Cascade.userCascade(req.user)
	}
	catch (e) {
		console.log(e)
		res.status(200).redirect("/")
	}
	res.status(200).redirect("/")
})


module.exports = router;
