const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const { ObjectId } = Schema.Types;

const DebtsSchema = new Schema(
  {
    chatId: { type: Number, required: true },
    debtor: { type: ObjectId, ref: 'UsersModel', required: true },
    creditor: { type: ObjectId, ref: 'UsersModel', required: true },
    debt: { type: Number, required: true, min: 1 },
    paid: { type: Number, default: 0, min: 0 },
    hasPaid: { type: Boolean, default: false },
    comment: String,
  },
  {
    collection: 'DebtsCollection',
    timestamps: true,
  },
);



module.exports = mongoose.model('DebtsModel', DebtsSchema);
