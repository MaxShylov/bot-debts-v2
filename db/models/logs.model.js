const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const LogsSchema = new Schema(
  {
    chatId: { type: Number, require: true },
    type: { type: String, enum: ['bot', 'web'], require: true },
    user: { type: Schema.Types.ObjectId, ref: 'UsersModel' },
    from: String,
    command: String,
    status: String,
    request: String,
    message: String,
  },
  {
    collection: 'LogsCollection',
    timestamps: true,
  },
);

module.exports = mongoose.model('LogsModel', LogsSchema);
