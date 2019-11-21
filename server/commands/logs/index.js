const getLogs = require('../logs/getLogs');


module.exports = (bot) => {

  bot.onText(/\/get_logs/, async (msg) => await getLogs(bot, msg));
  bot.onText(/\/get_logs@bt_debts_bot/, async (msg) => await getLogs(bot, msg));

};
