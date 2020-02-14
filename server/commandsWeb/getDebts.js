const config = require('../config');
const DebtsModel = require('../db/models/debts.model');

const chatId = config.get('CHAT_ID_BT');

const getDebts = async (req, res) => {
  const data = await DebtsModel.find({ chatId }, err => {
    if (err)
      return res.status(500).send(
        JSON.stringify({
          status: 'error',
          error: JSON.stringify(err.message),
        }),
      );
  })
    .lean()
    .exec();

  return res.send(JSON.stringify({ status: 'success', data }));
};

module.exports = getDebts;
