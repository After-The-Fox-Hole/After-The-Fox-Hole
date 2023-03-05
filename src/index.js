const app = require('./app.js')
const auth = require('./middleware/auth');
const {response} = require("express");
const Org = require("./models/org");
const User = require("./models/user");

const port = process.env.PORT;

app.listen(port, ()=>{
	console.log("server is up on: "+ port)
})

app.get('', (request, response) => {
	response.render('index')
});

app.post('/login', async (req, res)=>{
	try{
		let login = await User.findByCredentials(req.body.email, req.body.password);
		let token = await login.generateAuthToken();
		if (!login){
			login = await Org.findByCredentials(req.body.email, req.body.password);
			token = await login.generateAuthToken();
		}
		
			res.cookie("access_token", token, { httpOnly: true });
			res.redirect(301, `/profile`)
		 }
	catch (e){
		console.log(e)
		res.status(400).send("Bad credentials")
	}
})


