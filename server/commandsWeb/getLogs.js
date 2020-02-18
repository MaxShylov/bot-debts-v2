const LogsModel = require('../db/models/logs.model');

const getDebts = async (req, res) => {
  const { chatId, count } = req.query;
  const logs = await LogsModel.find({ chatId }, err => {
    if (err)
      return res.status(500).send(
        JSON.stringify({
          status: 'error',
          error: JSON.stringify(err.message),
        }),
      );
  })
    .sort('-createAt')
    .limit(count || 5)
    .lean()
    .exec();

  return res.send(JSON.stringify({ status: 'success', data: logs }));
};

module.exports = getDebts;
