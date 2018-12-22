const addUser = require('./addUser');
const listUsers = require('./listUsers');


module.exports = (bot) => {

  bot.onText(/\/add_user ([^;'\"]+)/, async (msg, match) => await addUser(bot, msg, match));
  bot.onText(/\/list_users/, async (msg) => await listUsers(bot, msg));

};
