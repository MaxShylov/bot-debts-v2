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

* В комaнде /add & /del вместо логина можно писать @i, @I, @me для того чтоб бот использовал ваш логин

Остальные команды
/add_debt - Добавить долг (Пошаговая команда)
/repay_debt - Отдать долг (Пошаговая команда)
/sum - добавление суммы в пошаговой команде

/delete_bot - Удалить бот
/cancel - Отменить операцию добавление/возрат долга в пошаговой команде
`;

module.exports = (bot, isConnectDB) => {
  bot.onText(/\/start/, async (msg) => {
    const chat = msg.hasOwnProperty('chat') ? msg.chat.id : msg.from.id;

    if (!isConnectDB) return bot.sendMessage(chat, 'База данных не подключенна');

    bot.sendMessage(chat, startText);

    schedule.scheduleJob({ date: 11 }, async () => {
      const str = await getDebts();

      bot.sendMessage(chat, str);
    });
  });

  bot.onText(/\/help/, async (msg) => {
    const chat = msg.hasOwnProperty('chat') ? msg.chat.id : msg.from.id;
    bot.sendMessage(chat, helpText);
  });


  bot.onText(/\/delete_bot/, (msg) => {
    const chat = msg.hasOwnProperty('chat') ? msg.chat.id : msg.from.id;

    bot.sendMessage(chat, 'Прощайте! :(');
    bot.leaveChat(chat);
  });

};
