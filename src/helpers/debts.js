const groupBy = require('lodash/groupBy');
const forEach = require('lodash/forEach');
const sumBy = require('lodash/sumBy');

const makeData = (debts, myName) => {
  const groupedDebts = groupBy(debts, 'debtor.name');
  const results = [];

  forEach(groupedDebts, (data, debtor) => {
    const group = groupBy(data, 'creditor.name');
    const resultDebtor = [];

    forEach(group, (debtsForOne, creditor) => {
      resultDebtor.push({
        creditor,
        sum: sumBy(debtsForOne, 'debt') - sumBy(debtsForOne, 'paid'),
        debts: !myName ? null : debtsForOne,
      });
    });

    resultDebtor.sort((a, b) => (b.creditor > a.creditor ? 1 : -1));

    results.push({
      debtor,
      total: sumBy(resultDebtor, 'sum'),
      debts: resultDebtor,
    });
  });

  if (myName) results.sort(val => (val.debtor !== myName ? 1 : -1));

  return results;
};

module.exports = {
  makeData,
};
