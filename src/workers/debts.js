const db = require('../../db');

/**
 *
 * @param {number} debtSum
 * @param {[Object]} debts
 * @return {Promise<number>}
 */
const deleteOldDebts = async (debtSum, debts) => {
  let sum = debtSum;

  for (let i = 0; i < debts.length; i++) {
    const { debt: oldDebt, paid, _id } = debts[i];
    const debt = oldDebt - paid;
    if (sum <= debt) {
      await db.debts.updateOneById(_id, {
        paid: paid + sum,
        hasPaid: sum === debt,
      });
      sum = 0;
      break;
    }

    await db.debts.updateOneById(_id, { paid: paid + debt, hasPaid: true });
    sum -= debt;
  }

  return sum;
};

module.exports = {
  deleteOldDebts,
};
