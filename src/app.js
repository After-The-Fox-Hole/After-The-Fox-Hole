const express = require('express')
require('./db/mongoose')
const userRouter = require('./routers/user');
const orgRouter = require('./routers/org');
const uniRouter = require('./routers/universal');
const cookieParser = require('cookie-parser');
const path = require("path");
const postRouter = require('./routers/posts');
const tagsRouter = require('./routers/tags');
const profileRouter = require('./routers/profile');
const eventRouter = require('./routers/events');
const bodyParser = require('body-parser');
const homepageRouter = require('./routers/homepage');
const votesRouter = require('./routers/votes');


const publicDirectory = path.join(__dirname, '../public')


const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.json());
app.use(userRouter);
app.use(orgRouter);
app.use(uniRouter);
app.use(postRouter);
app.use(profileRouter);
app.use(eventRouter);
app.use(homepageRouter);
app.use(tagsRouter);
app.use(votesRouter)




app.use(express.static(publicDirectory));

app.set('view engine', 'ejs');
const viewsPath = path.join(__dirname, '../templates/views')
app.set('views', viewsPath);

module.exports = app;

