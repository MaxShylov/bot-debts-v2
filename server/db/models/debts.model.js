const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const DebtsSchema = new Schema({
  chatId: Number,
  name: String,
  login: String,
  debts: Object,
  total: Number
},{
  collection: 'DebtsCollection'
});


module.exports = mongoose.model('DebtsModel', DebtsSchema);
