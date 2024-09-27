// controllers/paymentController.js
const Payment = require('../models/paymentModel');
const PaymentMethodDetail = require('../models/paymentMethodDetailModel');
const PaymentMethod = require('../models/paymentMethodModel');
const AgentDetail = require('../models/agentDetailModel');
const moment = require('moment');
const momenttz = require('moment-timezone');
const { Op } = require('sequelize'); // Import Op from Sequelize
const { v4: uuidv4 } = require('uuid');
const {
  cronosQris,
  cronosVirtualAccount,
  cronosEWallet,
  cronosSingleTransactions,
  cronosUpdateCallbackTransactions
} = require('../services/cronosGateway');
const gameController = require('./gameController');
const User = require('../models/userModel');
const { checkUserIdGames } = require('../services/apigamesGateway');
const {
  getInquiryDTU,
  getInquirySaldo,
  getCheckOrder,
  postInquiryPayment,
  postConfirmPayment
} = require('../services/unipinGateway');
const GamePackage = require('../models/gamePackageModel');
const { registerRandomUser } = require('./authController');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const {
  uniqueNamesGenerator,
  NumberDictionary,
  adjectives,
  colors,
  names
} = require('unique-names-generator');

const {
  getRandomUser,
  getRandomIndonesianPhoneNumber,
  getRandomDateTimeBetween,
  splitTransaction,
  encodeBase64
} = require('../dummy/funcRandomizeMasking');
const RulePayment = require('../models/rulePaymentModel');
const Agents = require('../models/agentModel');
const { getCodeUtil } = require('../utils/getCodeUtil');
const dummyPackage = require('../dummy/dummyUniplay');
const Buffer = require('buffer').Buffer;
const updateSimulatedPaymentStatus = exports.updateSimulatedPaymentStatus;




exports.getAllPayment = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    // Construct the query options
    let queryOptions = {
      where: {}
    };

    if (startDate && endDate) {
      // Convert input dates to Asia/Jakarta timezone and set time for start and end of the day
      const startOfDay = momenttz.tz(startDate, 'Asia/Jakarta').startOf('day').toDate();
      const endOfDay = momenttz.tz(endDate, 'Asia/Jakarta').endOf('day').toDate();

      queryOptions.where.request_date = {
        [Op.between]: [startOfDay, endOfDay]
      };
    }

    const payment = await Payment.findAll(queryOptions);
    let groupedDataArray = [];
    let totalUniqueDates = 0;
    let totalDataEntries = 0;

    if (payment.length) {
      // Group by just the date (YYYY-MM-DD)
      const formattedData = payment.reduce((acc, item) => {
        // Convert request_date to 'YYYY-MM-DD' format in Jakarta timezone (remove time part)
        const date = momenttz.tz(item.request_date, 'Asia/Jakarta').format('YYYY-MM-DD');
        
        if (!acc[date]) {
          acc[date] = {
            date,
            data: []
          };
        }

        acc[date].data.push(item);
        return acc;
      }, {});

      groupedDataArray = Object.values(formattedData);
      totalUniqueDates = groupedDataArray.length;
      totalDataEntries = payment.length;
    }

    const result = {
      totalUniqueDates,
      totalDataEntries,
      groupedDataArray
    };

    res.status(200).json(result);
  } catch (error) {
    res.status(400).send({ status: 'Bad Request', message: error.message });
  }
};


exports.getTotalTransactionsToday = async (req, res) => {
  try {
    const today = moment().startOf('day').toDate();
    const tomorrow = moment(today).add(1, 'days').toDate();

    const totalTransactionsToday = await Payment.count({
      where: {
        request_date: {
          [Op.between]: [today, tomorrow],
        },
      },
    });

    res.status(200).json({ totalTransactionsToday });
  } catch (error) {
    res.status(400).send({ status: 'Bad Request', message: error.message });
  }
};

exports.getPayment = async (req, res) => {
  try {
    const {
      id,
      limit,
      offset,
      paymentStatus,
      paymentMethod,
      startDate,
      endDate,
      user_id_nero,
      ref_id,
      nmid
    } = req.query;

    let isThisAgent = null;

    let isThisAgentWithRef = null;

    // Check if user is part of agent
    if (req.decoded.role === 'agent') {
      const user = await User.findOne({ where: { id: req.decoded.id } });
      if (user) {
        const agent = await AgentDetail.findAll({
          where: { agentDetailsId: user.agent_id }
        });
        if (agent) {
          isThisAgent = agent.map((val) => val.code);

          isThisAgentWithRef = user.ref_id;
        }
      }
    }

    // Construct the query options
    let queryOptions = {
      limit: parseInt(limit, 10) || 10, // Set default limit if not provided
      offset: parseInt(offset, 10) || 0, // Set default offset if not provided
      where: {},
      order: [['request_date', 'DESC']]
    };

    if (id) {
      queryOptions.where.id = id;
    }

    if (ref_id) {
      queryOptions.where.ref_id = ref_id;
    }

    if (nmid) {
      if (nmid === 'null') {
        queryOptions.where.nmid = { [Op.is]: null };
      } else if (nmid === 'notNull') {
        queryOptions.where.nmid = { [Op.ne]: null };
      } else {
        queryOptions.where.nmid = nmid;
      }
    }

    if (user_id_nero) {
      queryOptions.where.user_id_nero = user_id_nero;
    }

    if (paymentStatus) {
      queryOptions.where.payment_status = paymentStatus;
    }

    if (paymentMethod) {
      queryOptions.where.payment_method = paymentMethod;
    }

    if (startDate && endDate) {
      const endDatePlusOne = new Date(
        new Date(endDate).setDate(new Date(endDate).getDate() + 1)
      );

      queryOptions.where.request_date = {
        [Op.between]: [new Date(startDate), endDatePlusOne]
      };
    }

    if (isThisAgent || isThisAgentWithRef) {
      queryOptions.where[Op.or] = [];

      if (isThisAgent) {
        queryOptions.where[Op.or].push({ nmid: { [Op.in]: isThisAgent } });
      }

      if (isThisAgentWithRef) {
        queryOptions.where[Op.or].push({ ref_id: isThisAgentWithRef });
      }
    }

    const payments = await Payment.findAll(queryOptions);

    // Count total items without limit and offset
    const totalCount = await Payment.count({
      where: queryOptions.where,
      include: queryOptions.include
    });

    res.status(200).json({ payments, totalCount });
  } catch (error) {
    res.status(400).send({ status: 'Bad Request', message: error.message });
  }
};

exports.addPayment = async (req, res) => {
  try {
    // TODO: Create CRUD Games To Describe API Using Uniplay or not, and using api games or not
    // const gameHasToCheck = [
    //   {name: "PUBG Mobile (Indonesia)", id:"PUBG Mobile (Indonesia)", checkUsername: false, useUniplay: true},
    //   {name: "PUBG Mobile (Global)", id:"PUBG Mobile (Global)", checkUsername: false, useUniplay: true},
    //   {name: "Mobile Legends", id:"mobilelegend", checkUsername: true, useUniplay: true}
    // ];

    // TODO: Create Payment For Minimum Prices Transactions, E-Wallet 1k, Qris 5k, VA 10k

    const {
      ref_id,
      transaction_id,
      user_id,
      name,
      game_id,
      amount,
      payment_method,
      requested_date,
      phone_number,
      nmid,
      code,
      package,
      server_id
    } = req.body;

    const getCodeName = getCodeUtil(payment_method, code);

    let dto = {
      ref_id: ref_id || uuidv4(),
      transaction_id: transaction_id || uuidv4(),
      amount: amount,
      user_id: user_id,
      name: name,
      game_id: game_id,
      merchant_id: null,
      nmid: nmid,
      payment_method: payment_method,
      phone_number: phone_number,
      payment_date: null,
      request_date: requested_date,
      payment_status: 'Pending',
      package: package,
      server_id: server_id,
      inquiry_id: null,
      user_id_nero: req.decoded.id,
      fee: null,
      fee_reff: 0,
      rrn: null,
      ...getCodeName
    };

    let isLogicAllPassed = false;
    let finalResponse = null;

    // Check For Margin's Fee
    const queryOptions = {
      where: {
        code: '001', //hardcode for margin's fee
        is_active: true
      }
    };

    const rules = await RulePayment.findOne(queryOptions);

    // New Prices for Uniplay
    const fee = Math.floor((amount * rules.value) / 100);
    const newPriceWithFee = parseInt(amount, 10) + fee;

    // Check if payment using refferral
    let feeForAgents = 0;
    const isUsingRef = await User.findOne({ where: { ref_id: ref_id } });

    if (isUsingRef) {
      const agentsFee = await Agents.findOne({
        where: { id: isUsingRef.agent_id }
      });

      if (agentsFee) {
        feeForAgents = Math.floor((newPriceWithFee * agentsFee.fee) / 100);
      }
    }

    dto.fee_reff = feeForAgents;

    const isGameHasToCheck = await GamePackage.findOne({
      where: {
        is_active: true,
        name: game_id
      }
    });

    if (!isGameHasToCheck) {
      throw {
        message: 'Your Game is not available.'
      };
    }

    // check if the games was mobile legend or free fire
    // const isGameHasToCheck = gameHasToCheck.find(v => v.id == game_id);
    if (isGameHasToCheck && isGameHasToCheck.check_username) {
      const resp = await checkUserIdGames(dto);
      if (resp.status == 0) {
        throw {
          message: resp.error_msg
        };
      } else if (!resp.data.is_valid) {
        throw {
          message: resp.message
        };
      }
    }

    let dtoUniplay = {};

    if (isGameHasToCheck && isGameHasToCheck.use_uniplay) {
      // get data first
      const responseDTU = await getInquiryDTU();
      let choosenGame = responseDTU.list_dtu.find(
        (val) => val.name == isGameHasToCheck.title
      );
      if (!choosenGame) {
        throw {
          message: 'Wrong Game.'
        };
      }
      const choosenDenom = choosenGame.denom.find(
        (val) => val.package == dto.package
      );

      if (!choosenDenom) {
        throw {
          message: 'Wrong Products.'
        };
      }

      if (choosenDenom.price != dto.amount) {
        throw {
          message: 'Inputted Wrong Prices!'
        };
      }

      dtoUniplay = {
        entitas_id: choosenGame.id,
        denom_id: choosenDenom.id,
        user_id: dto.user_id,
        server_id: dto.server_id
      };

      isLogicAllPassed = true;
    }

    // if game uniplay have added fee's 5%
    if (isLogicAllPassed) {
      dto = {
        ...dto,
        amount: newPriceWithFee,
        fee: fee
      };
    }
    // Hit Cronos
    const resp = await sendCronosGateway({ ...dto, code });
    // Overwrite for addittionalInfo Callback Purposed API
    // resp.responseData.additionalInfo.callback = `${process.env.REDIRECT_HOST}/api/confirmation/${resp.responseData.id}`
    dto.merchant_id = dto.transaction_id;
    dto.transaction_id = resp.responseData.id;
    dto.rrn = resp.responseData.additionalInfo
      ? resp.responseData.additionalInfo.rrn || null
      : null;

    finalResponse = resp;

    if (isLogicAllPassed) {
      // Hit UniPlay
      const responseUniPlay = await postInquiryPayment(dtoUniplay);
      if (!responseUniPlay.inquiry_id) {
        throw {
          message: responseUniPlay.message
        };
      }
      dto.inquiry_id = responseUniPlay.inquiry_id;
    }

    await Payment.create(dto);

    res.status(200).json({
      status: 'Success',
      message: 'Success Adding Payment!',
      data: finalResponse
    });
  } catch (error) {
    console.log(error, '?');
    res.status(400).send({ status: 'Bad Request', message: error.message });
  }
};

exports.privateInitialPayment = async (req, res) => {
  try {
    // TODO: Create CRUD Games To Describe API Using Uniplay or not, and using api games or not
    // const gameHasToCheck = [
    //   {name: "PUBG Mobile (Indonesia)", id:"PUBG Mobile (Indonesia)", checkUsername: false, useUniplay: true},
    //   {name: "PUBG Mobile (Global)", id:"PUBG Mobile (Global)", checkUsername: false, useUniplay: true},
    //   {name: "Mobile Legends", id:"mobilelegend", checkUsername: true, useUniplay: true}
    // ];

    // TODO: Create Payment For Minimum Prices Transactions, E-Wallet 1k, Qris 5k, VA 10k

    const {
      ref_id,
      transaction_id,
      user_id,
      name,
      game_id,
      amount,
      payment_method,
      requested_date,
      phone_number,
      nmid,
      code,
      package,
      server_id
    } = req.body;

    let finalName = name;
    let finalUserId = user_id;
    let finalUserIdNero = null;

    

    if (!user_id) {
      // If user_id is missing, generate a random user_id
      const userIdLength = Math.random() < 0.5 ? 9 : 16;
      finalUserId = Math.floor(Math.random() * Math.pow(10, userIdLength))
        .toString()
        .padStart(userIdLength, '0');
    }

    // If user_id is missing or we need a user for user_id_nero, generate a new user
    if (!user_id || !user_id_nero) {
      const randomUser = await getRandomUser();
      finalUserIdNero = randomUser.id; // Assign the generated idUser to user_id_nero
    }

    // If name is not provided, generate it using the adjective, names, numberDictionary format
    if (name) {
      const numberDictionary = NumberDictionary.generate({
        min: 100,
        max: 999
      });
      const configNames = {
        dictionaries: [adjectives, names, numberDictionary]
      };
      finalName = uniqueNamesGenerator(configNames);
    }

    // If user_id_nero wasn't set, set it to user_id (this only happens if user_id was provided)
    if (!finalUserIdNero) {
      finalUserIdNero = finalUserId;
    }

    const splitAmountBy = 300000;

    const startDate = '2024-07-15';
    const endDate = '2024-07-24';

    const getCodeName = getCodeUtil(payment_method, code);
    let dto = {
      ref_id: ref_id || uuidv4(),
      transaction_id: transaction_id || uuidv4(),
      amount: amount,
      user_id: finalUserId,
      name: finalName,
      game_id: null,
      nmid: nmid,
      payment_method: payment_method,
      phone_number: await getRandomIndonesianPhoneNumber(),
      payment_date: null,
      // request_date: await getRandomDateTimeBetween(startDate, endDate),
      request_date: moment().format('YYYY-MM-DD HH:mm:ss'),
      payment_status: 'Pending',
      package: null,
      server_id: null,
      inquiry_id: null,
      user_id_nero: finalUserIdNero,
      fee: 0,
      fee_reff: 0,
      ...getCodeName
    };

    const listTransaction = await splitTransaction(dto);

    let finalResponses = [];

    for (const payment of listTransaction) {
      // Assuming sendCronosGateway is an asynchronous function
      const resp = await sendCronosGateway(payment);
      payment.merchant_id = payment.transaction_id;
      payment.transaction_id = resp.responseData.id;

      await Payment.create(payment);

      finalResponses.push(resp);
    }

    await Promise.all(finalResponses.map(async (data) => {
      await Payment.update(
        { nmid: data?.responseData?.additionalInfo?.nmid },
        { where: { merchant_id: data?.responseData?.merchantRef } }
      );
    }));

    res.status(200).json({
      status: 'Success',
      message: 'Success Adding Payment!',
      data: finalResponses
    });

    console.log(
      'this is finalresponse',
      finalResponses[0]?.responseData?.additionalInfo
    );
  } catch (error) {
    res.status(400).send({ status: 'Bad Request', message: error.message });
  }
};

exports.updatePayment = async (req, res) => {
  try {
    const { payment_id, payment_status } = req.body;
    const dto = {
      payment_status: payment_status
    };

    const payment = await Payment.findOne({ where: { id: payment_id } });

    if (!payment) {
      return res
        .status(400)
        .send({ status: 'Bad Request', message: 'Payment Not Found' });
    }

    await Payment.update(dto, { where: { id: payment_id } });
    res
      .status(200)
      .json({ status: 'Success', message: 'Success Updating Payment!' });
  } catch (error) {
    res.status(400).send({ status: 'Bad Request', message: error.message });
  }
};

const updatePaymentStatus = async (cronosStatus) => {
  if (cronosStatus === 'success') {
    return 'Success';
  } else if (cronosStatus === 'failed') {
    return 'Failed';
  } else {
    return 'Pending';
  }
};

exports.updatePaymentByUser = async (req, res) => {
  try {
    // const gameHasToCheck = [
    //   {name: "PUBG Mobile (Indonesia)", id:"PUBG Mobile (Indonesia)", checkUsername: false, useUniplay: true},
    //   {name: "PUBG Mobile (Global)", id:"PUBG Mobile (Global)", checkUsername: false, useUniplay: true},
    //   {name: "Mobile Legends", id:"mobilelegend", checkUsername: true, useUniplay: true}
    // ];

    const { payment_id } = req.body;

    const payment = await Payment.findOne({
      where: { merchant_id: payment_id }
    });

    if (!payment) {
      throw {
        message: 'Your Transactions Doesnt Exist.'
      };
    }

    const statusTransactionsCronos = await checkCronosPaymentStatus({
      payment_id: payment.transaction_id
    });

    const isGameHasToCheck = await GamePackage.findOne({
      where: {
        is_active: true,
        name: payment.game_id
      }
    });

    // check if the games was mobile legend or free fire
    //  const isGameHasToCheck = gameHasToCheck.find(v => v.id == payment.game_id);

    if (!isGameHasToCheck) {
      throw {
        message: 'Your Game is not available.'
      };
    }

    if (!payment) {
      return res
        .status(400)
        .send({ status: 'Bad Request', message: 'Payment Not Found' });
    }

    let dto = {
      payment_status: await updatePaymentStatus(
        statusTransactionsCronos.status
      ),
      payment_date: statusTransactionsCronos.paidDate,
      rrn: statusTransactionsCronos
        ? statusTransactionsCronos.rrn || null
        : null
    };
    if (
      isGameHasToCheck &&
      isGameHasToCheck.use_uniplay &&
      dto.payment_status == 'Success'
    ) {
      // GAME UNIPLAY
      const resp = await postConfirmPayment({
        inquiry_id: payment.inquiry_id,
        pincode: process.env.PINCODE_UNIPIN
      });
      if (resp.status == '200') {
        const dtos = {
          order_id_uniplay: resp.order_id
        };
        await Payment.update(dtos, { where: { merchant_id: payment_id } });
      } else {
        throw {
          message: resp.message
        };
      }
    } else if (
      isGameHasToCheck &&
      !isGameHasToCheck.use_uniplay &&
      dto.payment_status == 'Success'
    ) {
      // Hit Amount Coin in Nero Games
      await gameController.incrementCoin(
        payment.game_id,
        payment.user_id,
        payment.amount
      );
    } else if (
      dto.payment_status == 'Pending' ||
      dto.payment_status == 'Failed'
    ) {
      throw {
        message: 'You havent paid.'
      };
    }

    await Payment.update(dto, { where: { merchant_id: payment_id } });
    res
      .status(200)
      .json({ status: 'Success', message: 'Success Updating Payment!' });
  } catch (error) {
    res.status(400).send({ status: 'Bad Request', message: error.message });
  }
};

exports.privateUpdatePaymentByUser = async (req, res) => {
  try {
    // const gameHasToCheck = [
    //   {name: "PUBG Mobile (Indonesia)", id:"PUBG Mobile (Indonesia)", checkUsername: false, useUniplay: true},
    //   {name: "PUBG Mobile (Global)", id:"PUBG Mobile (Global)", checkUsername: false, useUniplay: true},
    //   {name: "Mobile Legends", id:"mobilelegend", checkUsername: true, useUniplay: true}
    // ];

    const { payment_id } = req.body;

    const payment = await Payment.findOne({
      where: { merchant_id: payment_id }
    });

    if (!payment) {
      throw {
        message: 'Your Transactions Doesnt Exist.'
      };
    }

    const statusTransactionsCronos = await checkCronosPaymentStatus({
      payment_id: payment.transaction_id
    });

    const isGameHasToCheck = await GamePackage.findOne({
      where: {
        is_active: true,
        name: payment.game_id
      }
    });

    // check if the games was mobile legend or free fire
    //  const isGameHasToCheck = gameHasToCheck.find(v => v.id == payment.game_id);

    // if (!isGameHasToCheck) {
    //   throw {
    //     message: 'Your Game is not available.'
    //   };
    // }

    if (!payment) {
      return res
        .status(400)
        .send({ status: 'Bad Request', message: 'Payment Not Found' });
    }

    let dto = {
      payment_status: await updatePaymentStatus(
        statusTransactionsCronos.status
      ),
      payment_date: statusTransactionsCronos.paidDate,
      rrn: statusTransactionsCronos
        ? statusTransactionsCronos.rrn || null
        : null
    };
    if (
      isGameHasToCheck &&
      isGameHasToCheck.use_uniplay &&
      dto.payment_status == 'Success'
    ) {
      // Create Account Random First
      const user = await getRandomUser();
      const numberDictionary = NumberDictionary.generate({
        min: 100,
        max: 999
      });
      const configNames = {
        dictionaries: [adjectives, names, numberDictionary]
      };

      const randomNames = uniqueNamesGenerator(configNames);

      // GAME UNIPLAY
      // const resp = await postConfirmPayment({
      //   inquiry_id: payment.inquiry_id,
      //   pincode: process.env.PINCODE_UNIPIN
      // });

      // if (resp.status == '200') {
      //   const dtos = {
      //     order_id_uniplay: resp.order_id,
      //     user_id_nero: user.id,
      //     user_id: randomNames,
      //     name: user.username
      //   };
      //   await Payment.update(dtos, { where: { merchant_id: payment_id } });
      // } else {
      //   throw {
      //     message: resp.message
      //   };
      // }

      const dtoOrderId = {
        entitas_id: 'Order',
        user_id: randomNames,
        status: 'Order'
      };
      const uniplay = await encodeBase64(dtoOrderId);
      dto = {
        ...dto,
        order_id_uniplay: uniplay,
        user_id_nero: user.id,
        user_id: randomNames,
        name: user.username
      };
      await Payment.update(dto, { where: { merchant_id: payment_id } });
    } else if (
      isGameHasToCheck &&
      !isGameHasToCheck.use_uniplay &&
      dto.payment_status == 'Success'
    ) {
      // Create User Random Generate
      const response = await generateRandomUserFunc();

      // Hit Amount Coin in Nero Games
      await gameController.incrementCoin(
        payment.game_id,
        response.idUser,
        payment.amount
      );
    } else if (
      dto.payment_status == 'Pending' ||
      dto.payment_status == 'Failed'
    ) {
      throw {
        message: 'You havent paid.'
      };
    }

    await Payment.update(dto, { where: { merchant_id: payment } });
    res
      .status(200)
      .json({ status: 'Success', message: 'Success Updating Payment!' });
  } catch (error) {
    res.status(400).send({ status: 'Bad Request', message: error.message });
  }
};

exports.privateConfirmationPayment = async (req, res) => {
  try {
    // const gameHasToCheck = [
    //   {name: "PUBG Mobile (Indonesia)", id:"PUBG Mobile (Indonesia)", checkUsername: false, useUniplay: true},
    //   {name: "PUBG Mobile (Global)", id:"PUBG Mobile (Global)", checkUsername: false, useUniplay: true},
    //   {name: "Mobile Legends", id:"mobilelegend", checkUsername: true, useUniplay: true}
    // ];

    const { payment_id } = req.params;

    const payment = await Payment.findOne({
      where: { merchant_id: payment_id }
    });

    if (!payment) {
      throw {
        message: 'Your Transactions Doesnt Exist.'
      };
    }

    const statusTransactionsCronos = await checkCronosPaymentStatus({
      payment_id: payment.transaction_id
    });

    console.log(
      'statusTransactionsCronos',
      statusTransactionsCronos?.additionalInfo?.rrn
    );

    const isGameHasToCheck = await GamePackage.findOne({
      where: {
        is_active: true,
        name: payment.game_id
      }
    });

    // check if the games was mobile legend or free fire
    //  const isGameHasToCheck = gameHasToCheck.find(v => v.id == payment.game_id);

    if (!isGameHasToCheck) {
      throw {
        message: 'Your Game is not available.'
      };
    }

    if (!payment) {
      return res
        .status(400)
        .send({ status: 'Bad Request', message: 'Payment Not Found' });
    }
    let dto = {
      payment_status: statusTransactionsCronos.status,
      payment_date: statusTransactionsCronos.paidDate,
      rrn: statusTransactionsCronos?.additionalInfo?.rrn ?? null
    };
    if (
      isGameHasToCheck &&
      isGameHasToCheck.use_uniplay &&
      dto.payment_status == 'Success'
    ) {
      if (!payment.nmid) {
        // GAME UNIPLAY
        const resp = await postConfirmPayment({
          inquiry_id: payment.inquiry_id,
          pincode: process.env.PINCODE_UNIPIN
        });
        if (resp.status == '200') {
          const dtos = {
            order_id_uniplay: resp.order_id
          };
          await Payment.update(dtos, { where: { merchant_id: payment_id } });
        } else {
          throw {
            message: resp.message
          };
        }
      }
    } else if (
      isGameHasToCheck &&
      !isGameHasToCheck.use_uniplay &&
      dto.payment_status == 'Success'
    ) {
      // Hit Amount Coin in Nero Games
      await gameController.incrementCoin(
        payment.game_id,
        payment.user_id,
        payment.amount
      );
    } else if (
      dto.payment_status == 'Pending' ||
      dto.payment_status == 'Failed'
    ) {
      throw {
        message: 'You havent paid.'
      };
    }

    await Payment.update(dto, { where: { merchant_id: payment_id } });

    // private transactions
    if (payment.nmid) {
      const data = {
        id: payment.transaction_id,
        status: dto.payment_status,
        rrn: dto.rrn,
        merchantRef: payment.merchant_id
      };

      console.log('payload to cronoss', data);

      const callback = await cronosUpdateCallbackTransactions(data);

      console.log('response callback', callback);
    }

    console.log('step 5');

    res
      .status(200)
      .json({ status: 'Success', message: 'Success Updating Payment!' });
  } catch (error) {
    res.status(400).send({ status: 'Bad Request', message: error.message });
  }
};

exports.checkStatusPaymentsCronos = async (req, res) => {
  try {
    const { payment_id } = req.params;

    const statusTransactions = await checkCronosPaymentStatus({ payment_id });
    res.status(200).json(statusTransactions);
  } catch (error) {
    res.status(400).send({ status: 'Bad Request', message: error.message });
  }
};

exports.getDTU = async (req, res) => {
  try {
    // Step 1: Retrieve current balance
    const saldoResponse = await getInquirySaldo();
    const currentBalance = parseFloat(saldoResponse.saldo);

    if (isNaN(currentBalance)) {
      return res
        .status(400)
        .send({ status: 'Bad Request', message: 'Unable to retrieve balance' });
    }

    // Step 2: Retrieve DTU data
    const dtuResponse = await getInquiryDTU();

    if (dtuResponse.status !== '200') {
      return res.status(400).send({
        status: 'Bad Request',
        message: 'Failed to retrieve DTU data'
      });
    }

    // Step 3: Filter products based on balance
    const affordableProducts = dtuResponse.list_dtu
      .map((product) => {
        const affordableDenoms = product.denom.filter(
          (denom) => parseFloat(denom.price) <= currentBalance
        );
        return {
          ...product,
          denom: affordableDenoms
        };
      })
      .filter((product) => product.denom.length > 0);

    // Step 4: Return filtered products
    res.status(200).json({
      response: {
        status: '200',
        message: 'Successfully',
        list_dtu: affordableProducts
      }
    });
  } catch (error) {
    res.status(400).send({ status: 'Bad Request', message: error.message });
  }
};

exports.getTotalBalances = async (req, res) => {
  try {
    const payments = await Payment.findAll({
      attributes: ['amount', 'payment_status']
    });

    const activeTotal = payments
      .filter((item) => item.payment_status === 'Success' || item.payment_status === 'success')
      .reduce((total, item) => total + parseFloat(item.amount), 0);

    const pendingTotal = payments
      .filter((item) => item.payment_status === 'Pending')
      .reduce((total, item) => total + parseFloat(item.amount), 0);

    res.status(200).json({
      activeTotal,
      pendingTotal
    });
  } catch (error) {
    res.status(400).send({ status: 'Bad Request', message: error.message });
  }
};

exports.getSaldoUni = async (req, res) => {
  try {
    const response = await getInquirySaldo();
    res.status(200).json({ response });
  } catch (error) {
    res.status(400).send({ status: 'Bad Request', message: error.message });
  }
};

exports.checkOrderOnUniPlay = async (req, res) => {
  try {
    const response = await getCheckOrder(req.params);
    res.status(200).json({ response });
  } catch (error) {
    res.status(400).send({ status: 'Bad Request', message: error.message });
  }
};

const randomInterval = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

const generateUserId = (gameName) => {
  switch (gameName) {
    case 'Black Clover M':
      return `SNCE${Math.floor(1000000000000 + Math.random() * 9000000000000)}`; // Example format: SNCE0358851607
    case 'Mobile Legends':
      return `${Math.floor(100000000 + Math.random() * 900000000)}(${Math.floor(1000 + Math.random() * 9000)})`; // Example format: 53671584(2086)
    case 'Free Fire':
      return `${Math.floor(1000000000 + Math.random() * 9000000000)}`; // Example format: 1907142964
    case 'Arena Of Valor':
      return `${Math.floor(1000000000000000 + Math.random() * 9000000000000000)}`; // Example format: 1799500902302877
    case 'Call of Duty Mobile (Bind FB)':
      return `${Math.floor(1000000000000000000 + Math.random() * 9000000000000000000)}`; // Example format: 8370310025568788107
    case 'Ragnarok Origin':
      return `TE${Math.random().toString(36).substr(2, 7).toUpperCase()}`; // Example format: TE75V6WP
    case 'New State Mobile (NC)':
      return `${Math.random().toString(36).substr(2, 8)}-${Math.random().toString(36).substr(2, 4)}-${Math.random().toString(36).substr(2, 4)}-${Math.random().toString(36).substr(2, 12)}`; // Example format: 8b2637c6-b70b-4673-a615-72c64243d7d4
    case 'Farlight 84':
      return `#${Math.floor(10000000 + Math.random() * 90000000)}`; // Example format: #41658945
    case 'League of Legends: Wild Rift':
      return `${Math.random().toString(36).substr(2, 10)}#${Math.floor(1000 + Math.random() * 9000)}`; // Example format: farhanzchri#7846
    case 'Sausage Man':
      return Math.random().toString(36).substr(2, 6).toLowerCase(); // Example format: rtf86w
    
    default:
      return Math.floor(100000000 + Math.random() * 900000000).toString(); // Fallback to 9-digit random number
  }
};

const generateEncodedId = (entitasId, userId, status) => {
  const idObject = {
    entitas_id: entitasId,
    user_id: userId,
    status: status
  };
  const jsonString = JSON.stringify(idObject);
  return Buffer.from(jsonString).toString('base64');
};

// Helper function to create a delay (in milliseconds)
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

// Helper function to generate random seconds within a given time range
const getRandomTimeInSeconds = (maxTimeInSeconds) => {
  return Math.floor(Math.random() * maxTimeInSeconds); // Random seconds between 0 and maxTimeInSeconds
};

// Helper function to convert seconds into a time format
const convertSecondsToTime = (seconds) => {
  return momenttz.utc(seconds * 1000).format('HH:mm:ss');
};

exports.simulateMultiplePayments = async (numberOfTransactions) => {
  try {
    const startTime = momenttz(); // The current time when the function starts running

    // Calculate the end time (23:59:59) on the same day in UTC+07
    const endTime = momenttz.tz('Asia/Bangkok').endOf('day'); // 23:59:59 on the current day

    // Calculate the total available time in milliseconds
    const totalTimeInMilliseconds = endTime.diff(startTime);

    // Calculate the average interval between transactions
    const averageIntervalInMilliseconds = totalTimeInMilliseconds / numberOfTransactions;

    


    for (let i = 0; i < numberOfTransactions; i++) {
      const transactionDelayInMilliseconds = averageIntervalInMilliseconds * i;
      // Calculate the target timestamp for the next transaction in UTC+07
      const nextTransactionTimestamp = moment(startTime).add(transactionDelayInMilliseconds, 'milliseconds');

      // Calculate how long to wait from now until the next transaction should be created
      const now = moment();
      const delayInMilliseconds = nextTransactionTimestamp.diff(now);

      console.log(`Transaction ${i + 1} will be created at ${nextTransactionTimestamp.format('YYYY-MM-DD HH:mm:ss')} (UTC+07) with a delay of ${delayInMilliseconds / 1000} seconds.`);

      // Wait for the calculated delay before creating the next transaction
      await delay(delayInMilliseconds);

      let finalName = null;
      let finalUserId = null;
      let finalUserIdNero = null;

      const ref_id = uuidv4();
      const transaction_id = uuidv4();
      const merchant_id = uuidv4();
      const userIdLength = Math.random() < 0.5 ? 9 : 16;
      finalUserId = Math.floor(Math.random() * Math.pow(10, userIdLength))
        .toString()
        .padStart(userIdLength, '0');

      const randomUser = await getRandomUser();
      finalUserIdNero = randomUser.id;
      const numberDictionary = NumberDictionary.generate({
        min: 100,
        max: 999
      });
      const configNames = {
        dictionaries: [adjectives, names, numberDictionary]
      };
      finalName = uniqueNamesGenerator(configNames);

      

      const payment_method = "Qris";
      const nmid = "omegapremium";
      const phone_number = await getRandomIndonesianPhoneNumber();

      const selectedGame = getRandomElement(dummyPackage.dummyUniplay.response.list_dtu);
      const selectedPackage = getRandomElement(selectedGame.denom);
      const amount = parseInt(selectedPackage.price);
      const fee = amount * 0.05;
      const packageName = selectedPackage.package;
      finalUserId = generateUserId(selectedGame.name);
      console.log('Selected game:', selectedGame);
      console.log('Selected package:', selectedPackage);

      let dto = {
        ref_id: ref_id,
        transaction_id: transaction_id,
        merchant_id: merchant_id,
        amount: amount,
        user_id: finalUserId,
        name: finalName,
        nmid: nmid,
        payment_method: payment_method,
        phone_number: phone_number,
        request_date: moment().format('YYYY-MM-DD HH:mm:ss'),
        payment_status: 'Pending', // Initial status
        package: packageName,
        game_id: selectedGame.name,
        fee: fee,
        fee_reff: null,
        inquiry_id: null,
        user_id_nero: finalUserIdNero,
        rrn: null,
        payment_date: null,
        server_id: null,
      };

      // Create the transaction
      console.log(`Creating transaction ${i + 1} of ${numberOfTransactions}...`);
      await Payment.create(dto);
      console.log(`Transaction created with transaction_id: ${transaction_id}`);

      // Simulate status update after a random delay
      const updateInterval = randomInterval(60 * 1000, 3 * 60 * 1000);
      setTimeout(async () => {
        try {
          console.log(`Attempting to update status for transaction_id: ${transaction_id}`);
          
          // 20% chance for 'Pending', otherwise 'Success'
          const paymentStatus = Math.random() < 0.2 ? 'Pending' : 'success';
          
          await exports.updateSimulatedPaymentStatus(transaction_id, paymentStatus);
          
        } catch (error) {
          console.error(`Error updating transaction ${transaction_id}:`, error.message);
        }
      }, updateInterval);
    }

    console.log(`${numberOfTransactions} transactions have been created and their statuses are being updated.`);
  } catch (error) {
    console.error('Error in simulateMultiplePayments:', error.message);
  }
};

// Call the function to simulate 50 transactions



exports.updateSimulatedPaymentStatus = async (transaction_id, status) => {
  try {
    console.log(`Received transaction_id: ${transaction_id} for status update`);

    const simulatedPayment = await Payment.findOne({ where: { transaction_id: transaction_id } });

    if (!simulatedPayment) {
      console.error(`Simulated payment with transaction_id ${transaction_id} not found.`);
      return;
    }

    if (status === 'success') {
      const paymentDate = moment().format('YYYY-MM-DD HH:mm:ss'); // Current date and time

      // Use user_id from the simulated payment record to generate the encoded ID
      const userId = simulatedPayment.user_id;

      // Generate order_id_uniplay and inquiry_id in the provided Base64 format
      const orderIdUniplay = generateEncodedId('Order', userId, 'Order');  // Base64 for order
      const inquiryId = generateEncodedId('Inquiry', userId, 'Inquiry');  // Base64 for inquiry

      simulatedPayment.payment_date = paymentDate;
      simulatedPayment.order_id_uniplay = orderIdUniplay;
      simulatedPayment.inquiry_id = inquiryId;

      console.log(`Generated payment_date: ${paymentDate}, order_id_uniplay: ${orderIdUniplay}, inquiry_id: ${inquiryId}`);
    }

    simulatedPayment.payment_status = status;
    await simulatedPayment.save();

    console.log(`Payment status updated successfully for transaction_id ${transaction_id} to ${status}.`);
  } catch (error) {
    console.error(`Error updating payment status for transaction_id ${transaction_id}:`, error.message);
  }
};




const checkCronosPaymentStatus = async (object) => {
  try {
    const response = await cronosSingleTransactions(object);
    return response.responseData;
  } catch (error) {
    throw { message: error };
  }
};

const generateRandomUserFunc = async () => {
  let idUser = '';
  let role = '';
  const numberDictionary = NumberDictionary.generate({ min: 100, max: 999 });
  const configNames = {
    dictionaries: [adjectives, names, numberDictionary]
  };

  const randomNames = uniqueNamesGenerator(configNames);
  const defaultPassword = process.env.DEFAULT_PASSWORD;

  const isUserAvailable = await User.findOne({
    where: { username: randomNames }
  });
  idUser = isUserAvailable?.id;
  role = isUserAvailable?.role;

  if (!isUserAvailable) {
    const hashedPassword = await bcrypt.hash(defaultPassword, 8);
    const user = await User.create({
      username: randomNames,
      password: hashedPassword,
      role: 'user',
      // email: '-',
      ref_id: null,
      is_active: 1
    });
    idUser = user.id;
    role = user.role;
  }

  const token = jwt.sign({ id: idUser }, process.env.SECRET_KEY_APPLICATION, {
    expiresIn: process.env.EXPIRED_TIME
  });

  await User.update({ token: token }, { where: { id: idUser } });

  return { username: randomNames, idUser, role };
};

const sendCronosGateway = async (object) => {
  try {
    if (object.payment_method == 'Virtual Account') {
      const detailPaymentMethod = await PaymentMethodDetail.findOne({
        where: { code: object.code }
      });

      if (detailPaymentMethod) {
        const paymentMethod = await PaymentMethod.findOne({
          where: { id: detailPaymentMethod.paymentMethodId }
        });

        if (paymentMethod) {
          if (paymentMethod.name == object.payment_method) {
            const dto = {
              bankCode: object.code,
              singleUse: true,
              type: 'ClosedAmount',
              reference: object.transaction_id,
              amount: object.amount,
              expiryMinutes: 30,
              viewName: object.name,
              additionalInfo: {
                callback: `${process.env.REDIRECT_HOST}/api/confirmation/${object.transaction_id}`
              }
            };
            const response = await cronosVirtualAccount(dto);
            return response;
          } else {
            throw { message: 'Methods is not the same.' };
          }
        } else {
          throw { message: 'Methods is not available.' };
        }
      } else {
        throw { message: 'Bank Code is not available' };
      }

      // await PaymentMethodDetail.
    } else if (object.payment_method == 'E-Wallet') {
      const detailPaymentMethod = await PaymentMethodDetail.findOne({
        where: { code: object.code }
      });

      if (detailPaymentMethod) {
        const paymentMethod = await PaymentMethod.findOne({
          where: { id: detailPaymentMethod.paymentMethodId }
        });

        if (paymentMethod) {
          if (paymentMethod.name == object.payment_method) {
            const dto = {
              phoneNumber: object.phone_number,
              channel: object.code,
              reference: object.transaction_id,
              amount: object.amount,
              expiryMinutes: 30,
              viewName: object.name,
              additionalInfo: {
                callback: `${process.env.REDIRECT_HOST}/api/confirmation/${object.transaction_id}`,
                successRedirectUrl: `${process.env.REDIRECT_HOST}/api/confirmation/${object.transaction_id}`
              }
            };

            const response = await cronosEWallet(dto);
            return response;
          } else {
            throw { message: 'Methods is not the same.' };
          }
        } else {
          throw { message: 'Methods is not available.' };
        }
      } else {
        throw { message: 'Channel is not available' };
      }
    } else if (object.payment_method == 'Qris') {
      const dto = {
        reference: object.transaction_id,
        amount: object.amount,
        expiryMinutes: 30,
        viewName: object.name,
        additionalInfo: {
          callback: `${process.env.REDIRECT_HOST}/api/confirmation/${object.transaction_id}`
        }
      };

      const response = await cronosQris(dto);
      return response;
    } else if (object.payment_method == 'Retail') {
      const detailPaymentMethod = await PaymentMethodDetail.findOne({
        where: { code: object.code }
      });

      if (detailPaymentMethod) {
        const paymentMethod = await PaymentMethod.findOne({
          where: { id: detailPaymentMethod.paymentMethodId }
        });

        if (paymentMethod) {
          if (paymentMethod.name == object.payment_method) {
            const dto = {
              phoneNumber: object.phone_number,
              channel: object.code,
              reference: object.transaction_id,
              amount: object.amount,
              expiryMinutes: 30,
              viewName: object.name,
              additionalInfo: {
                callback: `${process.env.REDIRECT_HOST}/api/confirmation/${object.transaction_id}`
              }
            };

            const response = await cronosEWallet(dto);
            return response;
          } else {
            throw { message: 'Methods is not the same.' };
          }
        } else {
          throw { message: 'Methods is not available.' };
        }
      } else {
        throw { message: 'Channel is not available' };
      }
    } else if (object.payment_method == 'Credit Card') {
      const dto = {
        reference: object.transaction_id,
        phoneNumber: object.phone_number,
        amount: object.amount,
        expiryMinutes: 30,
        viewName: object.name,
        additionalInfo: {
          callback: `${process.env.REDIRECT_HOST}/api/confirmation/${object.transaction_id}`
        }
      };

      const response = await cronosEWallet(dto);
      return response;
    } else {
      throw { message: 'Something Wrong with server.' };
    }
  } catch (error) {
    throw error;
  }
};

function getRandomElement(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

