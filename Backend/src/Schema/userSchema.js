const mongoose = require('mongoose');
const AutoIncrementFactory = require('mongoose-sequence');
const connectionString = 'mongodb+srv://test_user:test_user_pwd@cluster0.kbgeg.mongodb.net/finalInstaRice?retryWrites=true&w=majority';
const connection =   mongoose.createConnection(connectionString);
const AutoIncrement = AutoIncrementFactory(connection);

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required']
  },
  passwordSalt: {
    type: String,
    required: [true, 'Salt is required']
  },
  passwordHash: {
    type: String,
    required: [true, 'Hash is required']
  }
})
userSchema.plugin(AutoIncrement, {inc_field: 'id'});
module.exports = userSchema;
