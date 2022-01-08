const profileSchema = require('./Schema/profileSchema');
const userSchema = require('./Schema/userSchema');
const mongoose = require("mongoose");
const Profile = mongoose.model('profile', profileSchema);
const connectionString = 'mongodb+srv://test_user:test_user_pwd@cluster0.kbgeg.mongodb.net/finalInstaRice?retryWrites=true&w=majority';
const uploadImage = require('./uploadCloudinary.js').uploadImage;

function getData(req, res) {
    if (req.params.user == null) {
        getDataWithoutUsernameFromDatabase(req, res);
    } else {
        getDataWithUsernameFromDatabase(req, res);
    }
}

function getDateOfBirth(req, res) {
    if (req.params.user == null) {
        getDateOfBirthFromDatabaseWithoutUsername(req, res);
    } else {
        getDateOfBirthFromDatabaseWithUsername(req, res);
    }
}

function updateData(req, res) {
    let dataToEdit = req.originalUrl.split('/')[1];
    let data = req.body[dataToEdit];
    const connector =   mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true });
    connector.then(()=> {
        Profile.findOneAndUpdate({username: req.username}, {
            [dataToEdit]: data
        }, {upsert: false}, function (err, doc) {
            if (err) {
                res.sendStatus(500);
            } else {
                res.send({username: req.username, [dataToEdit]: data});
            }
        })
    })
}

const putAvatar = (req,res) => {
    const username = req.username;
    const avatar = req.fileurl;

    if (!avatar ) {
        res.status(400).send('Avatar not supplied');
    }
    const connector =   mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true });
    connector.then(()=>{
        Profile.updateOne(
            {username: username},
            { $set: { avatar:avatar}},
            function(){
                res.status(200).send({username,avatar});
            })
    })
}

const getDateOfBirthFromDatabaseWithoutUsername = (req, res) => {
    const connector =   mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true });
    connector.then(() => {
        Profile.findOne({username: req.username}, function(err, data) {
            if(data) {
                res.send({username: req.username, dateOfBirth: data.dateOfBirth})
            } else {
                res.sendStatus(404);
            }
        })
    })
}

const getDateOfBirthFromDatabaseWithUsername = (req, res) => {
    const connector =   mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true });
    connector.then(() => {
        Profile.findOne({username: req.params.user}, function(err, data) {
            if(data) {
                res.send({username: req.params.user, dateOfBirth: data.dateOfBirth})
            } else {
                res.sendStatus(404);
            }
        })
    })
}
function getFullProfile(req, res) {
    if (req.params.user == null) {
        getFullProfileWithoutUsername(req, res);
    } else {
        getFullProfileWithUsername(req, res);
    }
}

const getFullProfileWithoutUsername = (req, res) => {
    const connector =   mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true });
    connector.then(() => {
        Profile.findOne({username: req.username}, function(err, data) {
            if(data) {
                res.send({username: req.username, profile: data})
            } else {
                res.sendStatus(404);
            }
        })
    })
}

const getFullProfileWithUsername = (req, res) => {
    const connector =   mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true });
    connector.then(() => {
        Profile.findOne({username: req.params.user}, function(err, data) {
            if(data) {
                res.send({username: req.params.user, profile: data})
            } else {
                res.sendStatus(404);
            }
        })
    })
}

const getDataWithoutUsernameFromDatabase = (req, res) => {
    let dataToFind = req.originalUrl.split('/')[1];
    const connector =   mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true });
    connector.then(() => {
        Profile.findOne({username: req.username}, function(err, data) {
            if(data) {
                res.send({username: req.username, [dataToFind]: data[dataToFind]})
            } else {
                res.sendStatus(403);
            }
        })
    })
}

const getDataWithUsernameFromDatabase = (req, res) => {
    let dataToFind = req.originalUrl.split('/')[1];
    const connector =   mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true });
    connector.then(() => {
        Profile.findOne({username: req.params.user}, function(err, data) {
            if(data) {
                res.send({username: req.params.user, [dataToFind]: data[dataToFind]});
            } else {
                res.sendStatus(403);
            }
        })
    })
}

module.exports = (app) => {
    app.get('/profile/:user?', getFullProfile);
    app.get('/headline/:user?', getData);
    app.get('/email/:user?', getData);
    app.get('/zipcode/:user?', getData);
    app.get('/avatar/:user?', getData);
    app.get('/dob/:user?', getDateOfBirth);
    app.put('/headline', updateData);
    app.put('/email', updateData);
    app.put('/displayName', updateData);
    app.put('/zipcode', updateData);
    app.put('/phoneNumber', updateData);
    app.put('/avatar', uploadImage('image'),putAvatar);
}