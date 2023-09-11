const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes')
const { requireAuth,checkUser } = require('./middleware/authMiddleware');
const cookieParser = require('cookie-parser')
const app = express();

// middleware
app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// view engine
app.set('view engine', 'ejs');

// database connection
const dbURI = 'mongodb+srv://hesham:b4l9UHLud3cSdGyq@nodeblog.mct59nu.mongodb.net/node-auth';
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex:true })
  .then((result) => app.listen(3000))
  .catch((err) => console.log(err));

// routes
app.get('*', checkUser);  //applied to every request
app.get('/', (req, res) => res.render('home'));
app.get('/smoothies', requireAuth,(req, res) => res.render('smoothies'));
app.get('/create',requireAuth, (req,res) => res.render('create'));
app.use(authRoutes)



// app.get('/set-cookie', (req,res) => {
//   // res.setHeader('Set-Cookie','newUser=true')
//   res.cookie('newUser','false')
//   res.send('you got the cookies!')
// })

// app.get('/read-cookie', (req,res) => {
//   const cookies = req.cookies;
//   //ديه فايدة ال cookies parser
//   console.log(cookies.newUser);
//   res.json(cookies);
// })