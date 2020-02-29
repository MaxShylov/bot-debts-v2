const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UsersSchema = new Schema(
  {
    chatId: { type: Number, required: true },
    name: { type: String, required: true, index: { unique: true } },
    username: { type: String, required: true, index: { unique: true } },
  },
  {
    collection: 'UsersCollection',
    timestamps: true,
  },
);

module.exports = mongoose.model('UsersModel', UsersSchema);
