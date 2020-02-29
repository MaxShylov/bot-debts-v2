const { NODE_PORT } = process.env;
require('module-alias/register');

const http = require('http');

const app = require('./app');

const logsCommands = require('./src/commands/logs');
const usersCommands = require('./src/commands/users');
const debtsCommands = require('./src/commands/debts');
const debtsHistoryCommands = require('./src/commands/debtsHistory');

logsCommands();
usersCommands();
debtsCommands();
debtsHistoryCommands();

const server = http.createServer(app);

server.listen(NODE_PORT, () => {
  // eslint-disable-next-line no-console
  console.info(`Server was started on port ${NODE_PORT}`);
});
