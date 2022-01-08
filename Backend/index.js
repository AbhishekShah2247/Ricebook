const auth = require('./src/auth');
const article = require('./src/article');
const profile = require('./src/profile');
const following = require('./src/following');
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const profileSchema = require('./src/Schema/profileSchema');
const Profile = mongoose.model('profile', profileSchema);

const hello = (req, res) => res.send({ hello: 'world' });
const app = express();
const cors = require('cors');
const md5 = require("md5");

const connectionString = 'mongodb+srv://test_user:test_user_pwd@cluster0.kbgeg.mongodb.net/finalInstaRice?retryWrites=true&w=majority';

const corsOptions = {
  origin: ['localhost:4200'],
  optionsSuccessStatus: 200,
  credentials: true
}
let cookieKey = "sid";
app.use(function (req, res  , next) {
  const allowedOrigins = ['http://localhost:4200', 'https://www.googleapis.com/auth/plus.login', 'https://deafening-ricebook.surge.sh', 'http://deafening-ricebook.surge.sh'];
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  // res.header("Access-Control-Allow-Origin", "http://localhost:4200")
  res.header("Access-Control-Allow-Headers", 'Origin, Authorization, Content-Type, X-Requested-With, X-Session-Id, Accept')
  res.header("Access-Control-Allow-Methods", 'POST, PUT, GET, DELETE, OPTIONS')
  res.header("Access-Control-Allow-Credentials", 'true')

  if (req.method == 'OPTIONS') {
    res.status(200).send('success')
  } else {
    next()
  }
});
app.use(bodyParser.json());
app.use(cookieParser());
app.get('/', hello);
auth(app);
article(app);
profile(app);
following(app);

// Get the port from the environment, i.e., Heroku sets it
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  const addr = server.address();
  console.log(`Server listening at http://${addr.address}:${addr.port}`)
});
