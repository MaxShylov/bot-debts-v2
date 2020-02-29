require('./connect');

// Logs requests
const logs = require('./requests/logs');

// Users requests
const users = require('./requests/users');

// DebtsHistory requests
const debtsHistory = require('./requests/debtsHistory');

// Debts requests
const debts = require('./requests/debts');

module.exports = {
  logs,
  users,
  debtsHistory,
  debts,
};
