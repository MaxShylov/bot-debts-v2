const query = (label, type, isRequired) => ({ label, type, isRequired });

const queries = {
  // required
  name: query('name', 'string', true),
  newName: query('newName', 'string', true),
  username: query('username', 'username', true),
  oldUsername: query('oldUsername', 'username', true),
  newUsername: query('newUsername', 'username', true),
  userId: query('userId', 'id', true),
  debtorUsername: query('debtorUsername', 'username', true),
  creditorUsername: query('creditorUsername', 'username', true),
  debtSum: query('debtSum', 'integer', true),
  paidSum: query('paidSum', 'integer', true),

  // optional
  detail: query('detail', 'any', false),
  amount: query('amount', 'integer', false),
  time: query('time', 'integer', false),
  comment: query('comment', 'string', false),
};

module.exports = queries;
