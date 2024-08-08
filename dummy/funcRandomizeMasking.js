const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');
const dummyPackage = require('./dummyUniplay').dummyUniplay;
const bcrypt = require('bcryptjs');
const moment = require('moment');
const User = require('../models/userModel');
const {
  uniqueNamesGenerator,
  NumberDictionary,
  adjectives,
  colors,
  names
} = require('unique-names-generator');
const dummyRecovery = require('./dummyRecovery').dummyRecovery;
// const RecoveryQuestion = require('../models/recoveryQuestionModel');

const randomizePayment = [
  { id: 1, model: 'Qris', code: [] },
  {
    id: 2,
    model: 'Virtual Account',
    code: ['008', '002', '009', '011', '022']
  },
  { id: 3, model: 'E-Wallet', code: ['ovo', 'dana', 'shopeepay'] }
];

const listUsername = [
  'Agus',
  'Budi',
  'Citra',
  'Dewi',
  'Eka',
  'Fitri',
  'Gita',
  'Hendra',
  'Indra',
  'Joko',
  'Kartika',
  'Lestari',
  'Maya',
  'Nanda',
  'Oki',
  'Putra',
  'Qory',
  'Rina',
  'Siti',
  'Tono',
  'Umar',
  'Vina',
  'Wahyu',
  'Yuni',
  'Zainal',
  'Adi',
  'Bintang',
  'Cinta',
  'Dewi',
  'Eka',
  'Fajar',
  'Gita',
  'Hadi',
  'Indah',
  'Jaya',
  'Kiki',
  'Laksmi',
  'Maya',
  'Nita',
  'Oka',
  'Putra',
  'Rani',
  'Sari',
  'Tika',
  'Ulis',
  'Vina',
  'Wira',
  'Ikhsan',
  'Yani',
  'Zaki',
  'Adit',
  'Bima',
  'Ciko',
  'Dian',
  'Eko',
  'Fani',
  'Gani',
  'Hana',
  'Ika',
  'Jati',
  'Kurnia',
  'Lala',
  'Mira',
  'Nanda',
  'Oni',
  'Putri',
  'Riko',
  'Sita',
  'Taufik',
  'Udin',
  'Vera',
  'Wulan',
  'Yuda',
  'Zita',
  'Alin',
  'Budi',
  'Citra',
  'Dewa',
  'Eni',
  'Feri',
  'Gisel',
  'Hani',
  'Irma',
  'Juno',
  'Kiki',
  'Lia',
  'Mila',
  'Nanda',
  'Oki',
  'Putri',
  'Rudi',
  'Sinta',
  'Tami',
  'Uli',
  'Vina',
  'Widi',
  'Yani',
  'Zeni',
  'Andi',
  'Bima',
  'Cinta',
  'Dodi',
  'Evi',
  'Fitri',
  'Gita',
  'Hendra',
  'Irwan',
  'Jaya',
  'Kurnia',
  'Lila',
  'Mita',
  'Niko',
  'Oka',
  'Pala',
  'Rian',
  'Sari',
  'Tini',
  'Udin',
  'Vero',
  'Wina',
  'Yudi',
  'Zaki',
  'Anisa',
  'Bintang',
  'Citra'
];

// Removing duplicates
const indonesianFirstNames = [...new Set(listUsername)];
const indonesianLastNames = [
  'Pratama',
  'Wijaya',
  'Saputra',
  'Purnama',
  'Nugroho',
  'Santoso',
  'Sutanto',
  'Siregar',
  'Manurung',
  'Simanjuntak',
  'Saragih',
  'Nainggolan',
  'Sitorus',
  'Silalahi',
  'Hutabarat',
  'Pangaribuan',
  'Hutapea',
  'Ginting',
  'Tarigan',
  'Sembiring',
  'Sinaga',
  'Hutagalung',
  'Marpaung',
  'Sitompul',
  'Tobing'
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

exports.randomizeTransaction = (ex, randomizePayment) => {
  let transaction = { ...ex };
  
  if(!transaction.payment_method) {
    let paymentMethod = getRandomElement(randomizePayment);
    transaction.payment_method = paymentMethod.model;

    if (paymentMethod.code.length > 0) {
      transaction.code = getRandomElement(paymentMethod.code);
    }
  }

  return transaction;
};

exports.randomizePackage = (budget, choosenPackage) => {
  let bestPackage = null;

  choosenPackage.denom.forEach((item) => {
    const price = parseInt(item.price, 10);
    if (
      price <= budget &&
      (!bestPackage || price > parseInt(bestPackage.price, 10))
    ) {
      bestPackage = item;
    }
  });

  return bestPackage;
};

exports.splitTransaction = async (ex, fixAmount) => {
  let amount = parseInt(ex.amount);
  let transactions = [];
  let remainingAmount = amount;
  let transactionCount = 1;
  let choosenPackage = getRandomElement(dummyPackage.response.list_dtu);

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
    transaction = this.randomizeTransaction(transaction, randomizePayment);
    const packages = this.randomizePackage(fixAmount, choosenPackage);
    transaction.package = packages.package;
    transaction.game_id = choosenPackage.name;

    // New Prices for Uniplay
    const fee = Math.floor((transaction.amount * 5) / 100);
    const fee_reff = Math.floor((transaction.amount * 2) / 100);

    transaction.fee = fee;
    transaction.fee_reff = fee_reff;

    const dtoUniplay = {
      entitas_id: 'Test',
      user_id: transaction.user_id,
      server_id: 'Test'
    };

    const dtoOrderId = {
      entitas_id: 'Order',
      user_id: transaction.user_id,
      status: 'Order'
    };
    transaction.inquiry_id = await this.encodeBase64(dtoUniplay);
    transaction.order_id_uniplay = await this.encodeBase64(dtoOrderId);
    // transaction.inquiry_id = null

    transactions.push(transaction);
    transactionCount++;
  }

  return transactions;
};

exports.findBestPackage = (denom, budget) => {
  let bestPackage = null;

  denom.forEach((item) => {
    const price = parseInt(item.price, 10);
    if (
      price <= budget &&
      (!bestPackage || price > parseInt(bestPackage.price, 10))
    ) {
      bestPackage = item;
    }
  });

  return bestPackage;
};

// const budget = 500000;
//   const bestPackage = findBestPackage(denom, budget);

// const splitTransactions = splitTransaction(ex, fixAmount, randomizePayment);
// console.log(splitTransactions);

exports.getRandomDateTimeBetween = async (startDate, endDate) => {
  const start = moment(startDate).startOf('day'); // Start of the first day
  const end = moment(endDate).endOf('day'); // End of the last day
  const diff = end.diff(start, 'seconds');
  const randomSeconds = Math.floor(Math.random() * (diff + 1));
  const randomDateTime = start.clone().add(randomSeconds, 'seconds');
  return randomDateTime.format('YYYY-MM-DD HH:mm:ss');
};

// const startDate = '2024-07-15';
// const endDate = '2024-07-24';

// const randomDateTime = getRandomDateTimeBetween(startDate, endDate);
// console.log(randomDateTime.format('YYYY-MM-DD HH:mm:ss'))

exports.getRandomUser = async () => {
  let users = null;
  // const numberDictionary = NumberDictionary.generate({ min: 0, max: 999 });
  const configNames = {
    dictionaries: [indonesianFirstNames, indonesianLastNames],
    separator: ' ',
    style: 'capital'
  };

  let isSafe = false;
  let username = uniqueNamesGenerator(configNames);
  const defaultPassword = process.env.DEFAULT_PASSWORD;

  while (!isSafe) {
    const isUserAvailable = await User.findOne({ where: { username } });
    if (!isUserAvailable) {
      isSafe = true;
    } else {
      username = uniqueNamesGenerator(configNames);
    }
  }

  const hashedPassword = await bcrypt.hash(defaultPassword, 8);
  const choosenQuestion = getRandomElement(dummyRecovery);
  const choosenAnswer = getRandomElement(choosenQuestion.answer);
  const hashedAnswer = await bcrypt.hash(choosenAnswer, 8);

  //TODO: Will Added Recovery Random
  const user = await User.create({
    username: username,
    password: hashedPassword,
    role: 'user',
    // email: '-',
    recovery_question: choosenQuestion.id,
    recovery_answer: hashedAnswer,
    nik: null,
    ref_id: null,
    is_active: 1
  });

  users = user;

  const token = jwt.sign(
    { id: user.id, role: user.role },
    process.env.SECRET_KEY_APPLICATION,
    {
      expiresIn: process.env.EXPIRED_TIME
    }
  );

  await User.update({ token: token }, { where: { id: user.id } });
  return users;
};

// console.log(getRandomUser());

exports.getRandomIndonesianPhoneNumber = async () => {
  // Indonesian country code
  // const countryCode = '+62';
  const countryCode = '0';

  // Generate a random prefix for the phone number
  // Common prefixes for mobile numbers in Indonesia include: 812, 813, 815, 816, 817, 818, 819
  const prefixes = ['812', '813', '815', '816', '817', '818', '819'];
  const randomPrefix = prefixes[Math.floor(Math.random() * prefixes.length)];

  // Generate the rest of the phone number (7 to 9 digits)
  const numberLength = Math.floor(Math.random() * 3) + 7; // Random length between 7 and 9
  let phoneNumber = '';

  for (let i = 0; i < numberLength; i++) {
    phoneNumber += Math.floor(Math.random() * 10); // Append a random digit
  }

  return `${countryCode}${randomPrefix}${phoneNumber}`;
};

// Usage example
// const randomPhoneNumber = getRandomIndonesianPhoneNumber();
// console.log(randomPhoneNumber);

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

// this is for inquiry id, need to get from DTO object
exports.encodeBase64 = async (input) => {
  return Buffer.from(JSON.stringify(input)).toString('base64');
};

// console.log(encodeBase64(JSON.stringify({id:'asd',b:'cdcd'})))
