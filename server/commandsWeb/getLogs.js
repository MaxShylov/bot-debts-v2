const LogsModel = require('../db/models/logs.model');
const { errorMessage } = require('../helpers/common');

const getLogs = async (req, res) => {
  const { chatId, count = 5 } = req.query;

  const errorResponse = msg => res.status(500).send(errorMessage(msg));

  if (!chatId) return errorResponse('chatId is not exist');

  const logs = await LogsModel.find({ chatId }, err => {
    if (err) return errorResponse(err.message);
  })
    .sort('-createAt')
    .limit(count)
    .lean()
    .exec();

  return res.send(JSON.stringify({ status: 'success', data: logs }));
};

module.exports = getLogs;
