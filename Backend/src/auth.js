const md5 = require('md5');
const mongoose = require("mongoose");
const userSchema = require('./Schema/userSchema');
const profileSchema = require('./Schema/profileSchema');
const Profile = mongoose.model('profile', profileSchema);
const User = mongoose.model('user', userSchema);
const connectionString = 'mongodb+srv://your own username:your own password@cluster0.kbgeg.mongodb.net/finalInstaRice?retryWrites=true&w=majority';
const Passport = require('passport').Passport;
const passport = new Passport();
// const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const session = require('express-session');
const { OAuth2Strategy: GoogleStrategy } = require("passport-google-oauth");


REDIS_URL = "redis://:p03837fb4de19ed99db03039cb6edcf81b005f2e46199c0d5b222a230191efbf9@ec2-18-204-83-224.compute-1.amazonaws.com:19219";

const redis = require('redis').createClient(REDIS_URL);


let pepper = "InstaRicePepper";

let cookieKey = "sid";

function isLoggedIn(req, res, next) {
    if (!req.cookies || !req.cookies[cookieKey]) {
        return res.sendStatus(401);
    }

    const sid = req.cookies[cookieKey];

    redis.hmget('sessions', sid, function (err, object) {
        let username = JSON.parse(object[0]);

        // no username mapped to sid
        if (username) {
            req.username = username.username;
            req.session.username = username.username;
            next();
        }
        else {
            return res.sendStatus(401)
        }
    })
}

function login(req, res) {
    let username = req.body.username;
    let password = req.body.password;

    // supply username and password
    if (!username || !password) {
        return res.sendStatus(400);
    }

    // TODO: create hash using md5, user salt and request password, check if hash matches user hash

    const connector =   mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true });
    connector.then(() => {
        User.findOne({username: username}, function(err, data) {
            if(data) {
                let salt = data.passwordSalt;
                let hashToHash = md5(username + salt + password);
                let hash = md5(hashToHash + pepper);
                if(data.passwordHash === hash) {
                    let sid = md5(username + Date.now);
                    redis.hmset('sessions', sid, JSON.stringify({
                        "username": username,
                        "salt": salt,
                        "userId": data.id,
                        "email": data.email,
                        "hash": hash
                    }));
                    res.cookie(cookieKey, sid, {maxAge: 3600 * 1000, httpOnly: true, secure: true, sameSite: 'none'});//, secure: true, sameSite: 'none'
                    req.session.username = req.body.username;
                    let msg = {username: username, result: 'success'};
                    res.send(msg);
                } else {
                    res.sendStatus(403);
                }
            } else {
                res.sendStatus(403);
            }
        })
    })
}

function logout(req, res) {
    const sid = req.cookies[cookieKey];
    redis.del('sessions', sid);
    res.clearCookie(cookieKey);
    req.session.destroy();
    res.send({result: 'success'});
}

function register(req, res) {
    let username = req.body.email;
    const connector =   mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true });
    connector.then(()=> {
        User.findOne({username: req.body.email, gid: ""}, function (err, doc) {
            if (doc) {
                res.sendStatus(409);
            } else {
                let password = req.body.password;

                // supply username and password
                if (!username || !password) {
                    return res.sendStatus(400);
                }

                let salt = md5(username + password);
                let hashToHash = md5(username + salt + password);
                let hash = md5(hashToHash + pepper); // TODO: Change this to use md5 to create a hash
                connector.then(()=> new User({
                    username: req.body.email,
                    passwordSalt: salt,
                    passwordHash: hash,
                }).save());
                connector.then(()=> new Profile({
                    email: req.body.email,
                    zipcode: req.body.zipcode,
                    username: req.body.email,
                    displayName: req.body.displayName,
                    dateOfBirth: req.body.dateOfBirth,
                    phoneNumber: req.body.phoneNumber,
                    headline: "Hey I am " + username + ". I am new to InstaRice",
                    avatar: req.body.avatar
                }).save().then(data => {
                    let sid = md5(username + Date.now);
                    redis.hmset('sessions', sid, JSON.stringify({
                        "username": username,
                        "salt": salt,
                        "email": req.body.email,
                        "userId": data.userId,
                        "hash": hash
                    }));
                    res.cookie(cookieKey, sid, {maxAge: 3600 * 1000, secure: true, sameSite: 'none'});//, secure: true, sameSite: 'none'
                    let msg = {username: username, result: 'success'};
                    res.send(msg);
                }));
            }
        })
    });
}

function updatePassword(req, res) {
    let password = req.body.password;
    let passwordHash;
    const connector =   mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true });
    let pepper = "InstaRicePepper";
    let passwordSalt = md5(req.username + password);
    let hashToHash = md5(req.username + passwordSalt + password);
    passwordHash = md5(hashToHash + pepper);
    connector.then(()=> {
        User.findOneAndUpdate({username: req.username}, {
            passwordSalt: passwordSalt,
            passwordHash: passwordHash
        }, {upsert: false}, function (err, doc) {
            if (err) {
                res.sendStatus(500);
            } else {
                res.send({password: "Password has been updated"});
            }
        })
    });
}

function test(req, res) {
    res.send(
        { article: "test" }
    );
}

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});

passport.use(new GoogleStrategy({
            clientID: 'use your own client id',
            clientSecret: 'use your own client secret',
            callbackURL: "/auth/google/callback",
            passReqToCallback: true
        },
        function(req, accessToken, refreshToken, profile, done) {
            const session = req.session.username
            if(!session) {
                let user = {
                    'email': profile.emails[0].value,
                    'name' : profile.name.givenName + ' ' + profile.name.familyName,
                    'id'   : profile.id,
                    'token': accessToken
                };
                const connector =   mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true });
                connector.then(()=> {
                        Profile.findOne({gid: profile.id}, function(err, doc) {
                            if(!doc || err) {
                                new Profile({
                                    gid: profile.id,
                                    email: profile.emails[0].value,
                                    displayName: profile.displayName,
                                    username: profile.emails[0].value,
                                    following: [],
                                    avatar: profile.photos[0].value,
                                    headline: 'Hello Google User, welcome to InstaRice',
                                }).save(function (err, doc) {
                                    return done(null, user)
                                })
                            } else {
                                return done(null, user);
                            }
                        })
                    }
                )
            } else {
                let user = {
                    'email': profile.emails[0].value,
                    'name' : profile.name.givenName + ' ' + profile.name.familyName,
                    'id'   : profile.id,
                    'token': accessToken
                };

                console.log(req.profile)
                Profile.deleteOne({username: profile.emails[0].value, gid: profile.id}, {},function (err, doc) {
                    Profile.findOneAndUpdate({username: session, gid: ""}, {displayName: profile.displayName, email: profile.emails[0].value, gid: profile.id, avatar: profile.photos[0].value}, {upsert: false}, function(err, doc) {
                        return done(null, user);
                    })
                })
            }
        })
);

function loginWithGoogle(req, res) {
    let username = req.body.id;
    const connector =   mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true });
    connector.then(() => {
        Profile.findOneAndUpdate({gid: username},{gid: username}, {upsert: false},function(err, doc) {
            if(doc) {
                let sid = md5(doc.username + Date.now);
                redis.hmset('sessions', sid, JSON.stringify({
                    "username": doc.username,
                    "userId": doc.userId,
                    "email": doc.email,
                }));
                res.cookie(cookieKey, sid, {maxAge: 3600 * 1000, secure: true, sameSite: 'none'});//, secure: true, sameSite: 'none'
                // req.session.username = req.body.username;
                let msg = {username: doc.username, result: 'success'};
                res.send(msg);
            } else {
                res.sendStatus(401)
            }
        })
    })
}

function unlinkFromGoogle(req, res) {
    Profile.findOneAndUpdate({username: req.username, gid: {"$ne": ""}}, {gid: ""}, {}, function (err, doc) {
        if(err) {
            res.sendStatus(500)
        } else {
            res.send("success")
        }
    })
}

module.exports = (app) => {
    app.set('trust proxy',1)
    app.use(session({
        secret: 'doNotGuessTheSecret',
        resave: true,
        saveUninitialized: true,
        cookie: { maxAge: 3600 * 1000, httpOnly: true,
            secure: true, sameSite: 'none'
            }
    }));
    app.use(passport.initialize());
    app.use(passport.session());
    app.get('/auth/google', passport.authenticate('google',{ scope: ['https://www.googleapis.com/auth/plus.login', 'email', ] }));
    app.get('/auth/google/callback',
        passport.authenticate('google', {
            failureRedirect: 'https://deafening-ricebook.surge.sh/login',
            // failureRedirect: 'http://localhost:4200/login',
        }),
        function (req, res) {
            // res.cookie(cookieKey, sid, {maxAge: 3600 * 1000, secure: true, sameSite: 'none', httpOnly: true}) //, secure: true, sameSite: 'none', httpOnly: true
            // res.redirect('http://localhost:4200/loginWithGoogle/' + req.user.id)
            res.redirect('https://deafening-ricebook.surge.sh/loginWithGoogle/' + req.user.id);
        });
    app.get('/test', test);
    app.post('/login', login);
    app.post('/register', register);
    app.put('/logout', logout);
    app.post('/auth/google/login', loginWithGoogle);
    app.post('/auth/google/unlink', unlinkFromGoogle);
    app.use(isLoggedIn);
    app.get('/auth/google/link', passport.authenticate('google',{ scope: ['https://www.googleapis.com/auth/plus.login', 'email', ] }));
    app.put('/password', updatePassword);
}
