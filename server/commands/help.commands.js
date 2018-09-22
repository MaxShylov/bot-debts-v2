const { getDebts } = require('./debt.commands');

const schedule = require('node-schedule');

const startText = `
Данный бот был создан для контроля за долгами между людьми.
Изначально добавьте всех ползователей воспользовавшись командой
/add_user [ИМЯ] [ЛОГИН]
Потом вы сможете добавлять (/add) и удалять (/del) долги:
/add(del) [ЛОГИН_КТО] [ЛОГИН_КОМУ] [СУММА]

Каждое 11 число будет автоматически выводиться список долгов.
Или же вывести их вручную командой /get_debts

Про все команды вы можете узнать воспользовавшись командой /help
`;

const helpText = `
Частые команды
/add - Добавить долг (/add [ЛОГИН_КТО] [ЛОГИН_КОМУ] [СУММА]) *
/del - Отдать долг (/del [ЛОГИН_КТО] [ЛОГИН_КОМУ] [СУММА]) *
/get_debts - Получить список долгов
/add_user - Добавление пользователя (/add [ИМЯ] [ЛОГИН])
/list_users - Показать всех пользователей
/del_all - Отдать вседолги 


* В комaнде /add & /del вместо логина можно писать @i, @I, @me для того чтоб бот использовал ваш логин

/delete_bot - Удалить бот
`;

module.exports = (bot, isConnectDB) => {
  bot.onText(/\/start/, async (msg) => {
    const chat = msg.hasOwnProperty('chat') ? msg.chat.id : msg.from.id;

    if (!isConnectDB) return bot.sendMessage(chat, 'База данных не подключенна');

    schedule.scheduleJob({ date: 11 }, async () => {
      const str = await getDebts();

      bot.sendMessage(chat, str);
    });

    return bot.sendMessage(chat, startText);
  });

  bot.onText(/\/help/, (msg) => {
    const chat = msg.hasOwnProperty('chat') ? msg.chat.id : msg.from.id;
    return bot.sendMessage(chat, helpText);
  });

  bot.onText(/\/delete_bot/, (msg) => {
    const chat = msg.hasOwnProperty('chat') ? msg.chat.id : msg.from.id;

    bot.sendMessage(chat, 'Прощайте! :(');
    bot.leaveChat(chat);
  });
};
