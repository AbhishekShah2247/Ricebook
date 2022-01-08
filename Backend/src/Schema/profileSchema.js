const mongoose = require('mongoose');
const AutoIncrementFactory = require('mongoose-sequence');
const connectionString = 'mongodb+srv://test_user:test_user_pwd@cluster0.kbgeg.mongodb.net/finalInstaRice?retryWrites=true&w=majority';
const connection =   mongoose.createConnection(connectionString);
const AutoIncrement = AutoIncrementFactory(connection);
const profileSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [false],
        default: '',
    },
    following: {
        type: Array,
        required: [false],
        default: [],
    },
    phoneNumber: {
        type: String,
        required: [false],
        default: '',
    },
    zipcode: {
        type: String,
        required: [false],
        default: '',
    },
    dateOfBirth: {
        type: String,
        required: [false],
        default: '',
    },
    displayName: {
        type: String,
        required: [true, 'Display Name is required']
    },
    username: {
        type: String,
        required: [true, 'Username is required']
    },
    gid: {
        type: String,
        required: [false],
        default: '',
    },
    headline: {
        type: String,
        required: [true, 'Headline is required']
    },
    avatar: {
        type: String,
        required: [false],
        default: '',
    }
})
profileSchema.plugin(AutoIncrement, {inc_field: 'userId'});
module.exports = profileSchema;