const md5 = require('md5');
const profileSchema = require('./Schema/profileSchema');
const mongoose = require("mongoose");
const Profile = mongoose.model('profile', profileSchema);
const connectionString = 'mongodb+srv://your own username:your own password@cluster0.kbgeg.mongodb.net/finalInstaRice?retryWrites=true&w=majority';


const getFollowing = (req, res) => {
    let followingUser = req.params.user;
    if(followingUser == null) {
        followingUser = req.username;
    }
    const connector =   mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true });
    connector.then(() => {
        Profile.findOne({username: followingUser}, function(err, data) {
            if(data) {
                res.send({username: followingUser, following: data.following})
            } else {
                res.sendStatus(404);
            }
        })
    })
}

const putFollowing = (req, res) => {
    let user = req.params.user;
    const connector =   mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true });
    connector.then(()=> {
        Profile.findOne({username: user}, async(err, doc) => {
            if(!doc) {
                res.sendStatus(404);
            } else {
                const userToUpdate = await Profile.findOne({username: req.username});
                const index = userToUpdate.following.indexOf(user);
                if (index === -1 && userToUpdate.username !== user) {
                    userToUpdate.following.push(user);
                }
                userToUpdate.save(function(err, doc) {
                    if(err) {
                        res.sendStatus(500)
                    } else {
                        res.send(doc);
                    }
                })
            }
        })
    })
}

const deleteFollowing = (req, res) => {
    let user = req.params.user;
    const connector =   mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true });
    connector.then(()=> {
        Profile.findOne({username: req.username}, async(err, doc) => {
            if(err) {
                res.sendStatus(405);
            } else {
                const userToRemove = await Profile.findOne({username: user});
                if(userToRemove === null) {
                    res.send(404)
                } else {
                    const index = doc.following.indexOf(userToRemove.username);
                    if (index > -1) {
                        doc.following.splice(index, 1);
                        doc.save(function (err, doc) {
                            if (err) {
                                res.sendStatus(500)
                            } else {
                                res.send(doc);
                            }
                        })
                    } else {
                        res.sendStatus(404);
                    }
                }
            }
        })
    })
}

module.exports = (app) => {
    app.get('/following/:user?', getFollowing);
    app.put('/following/:user', putFollowing);
    app.delete('/following/:user', deleteFollowing);
}
