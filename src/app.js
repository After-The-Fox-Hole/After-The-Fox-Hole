const express = require('express')
require('./db/mongoose')
const userRouter = require('./routers/user')
const cookieParser = require('cookie-parser');
const path = require("path");



const publicDirectory = path.join(__dirname, '../public')


const app = express();

app.use(cookieParser());

app.use(express.json());
app.use(userRouter);





app.use(express.static(publicDirectory));

app.set('view engine', 'ejs');
const viewsPath = path.join(__dirname, '../templates/views')
app.set('views', viewsPath);

module.exports = app;

