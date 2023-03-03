const app = require('./app.js')
const auth = require('./middleware/auth');
const {response} = require("express");

const port = process.env.PORT;

app.listen(port, ()=>{
	console.log("server is up on: "+ port)
})

app.get('', (request, response) => {
	response.render('index')
});


