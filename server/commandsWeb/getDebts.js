const DebtsModel = require('../db/models/debts.model');

const getDebts = async (req, res) => {
  const { chatId } = req.query;
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
