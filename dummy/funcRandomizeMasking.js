const { v4: uuidv4 } = require('uuid');
const dummyPackage = require('./dummyUniplay').dummyUniplay;

const randomizePayment = [
  { id: 1, model: 'Qris', code: [] },
  {
    id: 2,
    model: 'Virtual Account',
    code: ['014', '008', '002', '009', '013', '011', '022']
  },
  { id: 3, model: 'E-Wallet', code: ['ovo', 'dana', 'shopeepay', 'linkaja'] }
];

const fixAmount = 300000;

const ex = {
  name: '',
  user_id: '',
  game_id: '',
  amount: '500000',
  phone_number: '0813119797',
  payment_method: 'Qris',
  code: null,
  nmid: null,
  merchant_id: null,
  transaction_id: null,
  payment_date: '2024-07-11T14:19:09.059Z',
  requested_date: '2024-07-11T14:19:09.059Z',
  server_id: 'JAPAN',
  package: '60 + 5 Tokens',
  ref_id: 'asd' // for refferral
};

function getRandomElement(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function randomizeTransaction(ex, randomizePayment) {
  let paymentMethod = getRandomElement(randomizePayment);
  let transaction = { ...ex };

  transaction.payment_method = paymentMethod.model;

  if (paymentMethod.code.length > 0) {
    transaction.code = getRandomElement(paymentMethod.code);
  }

  return transaction;
}

function randomizePackage(budget, choosenPackage) {
    let bestPackage = null;

    choosenPackage.denom.forEach(item => {
    const price = parseInt(item.price, 10);
    if (price <= budget && (!bestPackage || price > parseInt(bestPackage.price, 10))) {
      bestPackage = item.package;
    }
  });

  return bestPackage;
}

function splitTransaction(ex, fixAmount, randomizePayment) {
  let amount = parseInt(ex.amount);
  let transactions = [];
  let remainingAmount = amount;
  let transactionCount = 1;
  let choosenPackage = getRandomElement(dummyPackage.response.list_dtu)

  while (remainingAmount > 0) {
    let transaction = { ...ex };

    if (remainingAmount > fixAmount) {
      transaction.amount = fixAmount.toString();
      remainingAmount -= fixAmount;
    } else {
      transaction.amount = remainingAmount.toString();
      remainingAmount = 0;
    }

    transaction.transaction_id = uuidv4();
    transaction = randomizeTransaction(transaction, randomizePayment);
    transaction.package = randomizePackage(fixAmount, choosenPackage);

    transactions.push(transaction);
    transactionCount++;
  }

  return transactions;
}

const findBestPackage = (denom, budget) => {
    let bestPackage = null;
  
    denom.forEach(item => {
      const price = parseInt(item.price, 10);
      if (price <= budget && (!bestPackage || price > parseInt(bestPackage.price, 10))) {
        bestPackage = item;
      }
    });
  
    return bestPackage;
  };
  
  const budget = 500000;
//   const bestPackage = findBestPackage(denom, budget);

const splitTransactions = splitTransaction(ex, fixAmount, randomizePayment);
console.log(splitTransactions);

// let dto = {
//     ref_id: ref_id || uuidv4(),
//     transaction_id: transaction_id || uuidv4(),
//     amount: amount,
//     user_id: user_id,
//     name: name,
//     game_id: game_id,
//     nmid: nmid,
//     payment_method: payment_method,
//     phone_number: phone_number,
//     payment_date: null,
//     request_date: requested_date,
//     payment_status: 'Pending',
//     package: package,
//     server_id: server_id,
//     inquiry_id: null,
//     user_id_nero: req.decoded.id
//   };
