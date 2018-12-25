const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const LogsSchema = new Schema({
  chatId: Number,
  log: String,
  createAt: { type: Date, default: Date.now },
  updateAt: { type: Date, default: Date.now }
},{
  collection: 'LogsCollection'
});


module.exports = mongoose.model('LogsModel', LogsSchema);
