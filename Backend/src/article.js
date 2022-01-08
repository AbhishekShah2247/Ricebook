const articleSchema = require('./Schema/articleSchema');
const mongoose = require("mongoose");
const {response} = require("express");
const profileSchema = require("./Schema/profileSchema");
const Article = mongoose.model('article', articleSchema);
const Profile = mongoose.model('profile', profileSchema);
const connectionString = 'mongodb+srv://test_user:test_user_pwd@cluster0.kbgeg.mongodb.net/finalInstaRice?retryWrites=true&w=majority';
const uploadImage = require('./uploadCloudinary.js').uploadImage;

function getArticle(req, res) {
    if (req.params.id == null) {
        getArticleFromDbWithoutArticleId(req, res);
    } else {
        getArticleFromDbWithArticleId(req, res, req.params.id);
    }
}

function addArticle(req, res) {
    let title = req.body.title;
    let body = req.body.text;
    const imagePost = req.fileurl;

    if (!body) {
        return res.sendStatus(400);
    }
    addArticleToDb(req.username, title, body, imagePost, req, res);
}

function editArticle(req, res) {
    let body = req.body.text;
    let commentId = req.body.commentId;
    let postId = req.params.id;
    if(isNaN(parseInt(postId))) {
        res.send(400)
    } else {
        if(commentId == null) {
            editArticleToDbForArticleModification(req, res, body, postId);
        } else {
            editArticleToDbForCommentModification(req, res, body, commentId, postId);
        }
    }
}

const addArticleToDb = (username, title, body, imagePost, req, res) => {
    const connector =   mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true });
    connector.then(()=> new Article({
        username: username,
        title: title,
        body: body,
        image: (imagePost!=null)?imagePost: '',
        datePosted: Date.now(),
    }).save((err, article) => {
        if(article) {
            res.status(200).send({articles: [article]})
        }
    }))
};

const getArticleFromDbWithoutArticleId = (req, res) => {
    let data_arr = [];
    const connector =   mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true });
    connector.then(() => {
        Profile.findOne({username:req.username},async function (err,data) {
            if(err){
                console.log(err)
                res.sendStatus(500)
            }
            if(!data){
                res.sendStatus(500)
            }
            let followers = data.following
            followers.push(req.username)
            let q = Article.find({username: followers}).sort({'datePosted': 'descending'}).limit(10);
            await q.exec(function(err, data) {
                if(data) {
                    res.send({ articles: data })
                } else {
                    res.sendStatus(503);
                }
            });

        });

    })
    // const connector =   mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true });
    // connector.then(() => {
    //     Article.find({username: req.username}, function(err, data) {
    //         if(data) {
    //             res.send({articles: data});
    //         } else {
    //             res.sendStatus(404);
    //         }
    //     })
    // })
};

const getArticleFromDbWithArticleId = (req, res, articleId) => {
    const connector =   mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true });
    let id = parseInt(articleId);
    if (isNaN(id)) {
        connector.then(() => {
            Article.find({username: articleId}, function(err, data) {
                if(data) {
                    res.send({articles: data});
                } else {
                    res.sendStatus(404);
                }
            })
        })
    } else {
        connector.then(() => {
            Article.find({postId: articleId}, function(err, data) {
                if(data) {
                    res.send({articles: data});
                } else {
                    res.sendStatus(404);
                }
            })
        })
    }
};

const editArticleToDbForArticleModification = (req, res, body, postId) => {
    (async () => {
        let postToEditId = parseInt(postId);
        const connector =   mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true });
        await connector.then(()=> {
            Article.findOneAndUpdate({postId: postToEditId, username: req.username}, {
                body: body
            }, {upsert: false}, function (err, doc) {
                if (err) {
                    res.sendStatus(404);
                } else {
                    getArticleFromDbWithoutArticleId(req, res);
                }
            })
        })
    })();
};

const editArticleToDbForCommentModification = (req, res, body, commentId, postId) => {
    (() => {
        const connector =   mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true });
        connector.then(async ()=> {
            const article = await Article.findOne({postId: parseInt(postId)});
            if(article) {
                let commentFound = false;
                let commentToAdd;
                if(article.comments.length === 0) {
                    commentToAdd = {
                        username: req.username,
                        commentId: 1,
                        comment: body
                    };
                    article.comments.unshift(commentToAdd);
                } else {
                    commentToAdd = {
                        username: req.username,
                        commentId: article.comments[0].commentId + 1,
                        comment: body
                    };
                    article.comments.forEach(comment => {
                        if(comment.commentId === commentId) {
                            comment.comment = body;
                            commentFound = true;
                        }
                    })
                    if(commentFound === false) {
                        article.comments.unshift(commentToAdd);
                        commentFound = true;
                    }
                }
                article.markModified('comments')
                await article.save().then(response => {
                    res.send(response);
                });
            } else {
                res.sendStatus(404);
            }
        })
    })();
};

module.exports = (app) => {
    app.get('/articles/:id?', getArticle);
    app.post('/article', uploadImage('image'), addArticle);
    app.put('/articles/:id', editArticle);
}