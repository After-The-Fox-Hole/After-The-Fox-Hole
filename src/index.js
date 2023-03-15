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
	let attempt = {
		status: "first"
	}
	response.render('login', ({attempt}))
});

app.get("/about", (req, res) =>{
	
	res.render('aboutUs')
})

app.get('*', function(req, res) {
	res.render('login')
});



