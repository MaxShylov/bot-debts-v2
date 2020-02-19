const DebtsModel = require('../db/models/debts.model');
const { errorMessage } = '../helpers/common';

const getDebts = async (req, res) => {
  const { chatId } = req.query;
  const errorResponse = (msg) => res.status(500).send(errorMessage(msg));

  if (!chatId) return errorResponse('chatId is not exist');

  const data = await DebtsModel.find({ chatId }, err => {
    if (err) return errorResponse(err.message);
  })
    .lean()
    .exec();

  return res.send(JSON.stringify({ status: 'success', data }));
};

module.exports = getDebts;
