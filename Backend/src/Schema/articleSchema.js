const mongoose = require('mongoose')
const AutoIncrementFactory = require('mongoose-sequence');
const connectionString = 'mongodb+srv://test_user:test_user_pwd@cluster0.kbgeg.mongodb.net/finalInstaRice?retryWrites=true&w=majority';
const connection =   mongoose.createConnection(connectionString);
const AutoIncrement = AutoIncrementFactory(connection);

const articleSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username is required']
    },
    datePosted: {
        type: Date,
        required: [true]
    },
    title: {
        type: String,
        required: [false],
        default: '',
    },
    body: {
        type: String,
        required: [true, 'Post cannot be empty']
    },
    image: {
        type: String,
        required: [false],
        default: '',
    },
    comments: {
        type: Array,
        required: [false],
        default: []
    },
});
articleSchema.plugin(AutoIncrement, {inc_field: 'postId'});

module.exports = articleSchema;