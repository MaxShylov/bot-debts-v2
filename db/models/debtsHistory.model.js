const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const { ObjectId } = Schema.Types;

const DebtsHistorySchema = new Schema(
  {
    chatId: { type: Number, required: true },
    type: { type: String, enum: ['add', 'del'], required: true },
    debtor: { type: ObjectId, ref: 'UsersModel', required: true },
    creditor: { type: ObjectId, ref: 'UsersModel', required: true },
    sum: { required: true, type: Number, min: 1 },
    comment: String,
  },
  {
    collection: 'DebtsHistoryCollection',
    timestamps: true,
  },
);

module.exports = mongoose.model('DebtsHistoryModel', DebtsHistorySchema);
