// controllers/paymentController.js
const Payment = require('../models/paymentModel');
const PaymentMethodDetail = require('../models/paymentMethodDetailModel');
const PaymentMethod = require('../models/paymentMethodModel');
const AgentDetail = require('../models/agentDetailModel');
const { Op } = require('sequelize'); // Import Op from Sequelize
const { v4: uuidv4 } = require('uuid');
const {
  cronosQris,
  cronosVirtualAccount,
  cronosEWallet,
  cronosSingleTransactions
} = require('../services/cronosGateway');
const gameController = require('./gameController');
const User = require('../models/userModel');
const { checkUserIdGames } = require('../services/apigamesGateway');
const { getInquiryDTU, getInquirySaldo, getCheckOrder, postInquiryPayment, postConfirmPayment } = require('../services/unipinGateway');
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

exports.getAllPayment = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    // Construct the query options
    let queryOptions = {
      where: {}
    };

    if (startDate && endDate) {
      queryOptions.where.payment_date = {
        [Op.between]: [new Date(startDate), new Date(endDate)]
      };
    }

    const payment = await Payment.findAll(queryOptions);
    res.status(200).json(payment);
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
      endDate
    } = req.query;

    let isThisAgent = null;

    // Check if user is part of agent
    if (req.decoded.role === 'agent') {
      const user = await User.findOne({ where: { id: req.decoded.id } });
      if (user) {
        const agent = await AgentDetail.findAll({
          where: { agentDetailsId: user.agent_id }
        });
        if (agent) {
          isThisAgent = agent.map((val) => val.code);
        }
      }
    }

    // Construct the query options
    let queryOptions = {
      limit: parseInt(limit, 10) || 10, // Set default limit if not provided
      offset: parseInt(offset, 10) || 0, // Set default offset if not provided
      where: {}
    };

    if (id) {
      queryOptions.where.id = id;
    }

    if (paymentStatus) {
      queryOptions.where.payment_status = paymentStatus;
    }

    if (paymentMethod) {
      queryOptions.where.payment_method = paymentMethod;
    }

    if (startDate && endDate) {
      queryOptions.where.payment_date = {
        [Op.between]: [new Date(startDate), new Date(endDate)]
      };
    }

    if (isThisAgent) {
      queryOptions.where.nmid = { [Op.in]: isThisAgent };
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

    let dto = {
      ref_id: ref_id || uuidv4(),
      transaction_id: transaction_id || uuidv4(),
      amount: amount,
      user_id: user_id,
      name: name,
      game_id: game_id,
      nmid: nmid,
      payment_method: payment_method,
      phone_number: phone_number,
      payment_date: null,
      request_date: requested_date,
      payment_status: 'Pending',
      package: package,
      server_id: server_id,
      inquiry_id: null
    };

    let isLogicAllPassed = false;
    let finalResponse = null;

    const isGameHasToCheck = await GamePackage.findOne({where: {
      is_active: true, name: game_id
    }})

    // return console.log(isGameHasToCheck && isGameHasToCheck.check_username,'??')
    if(!isGameHasToCheck) {
      throw {
        message: 'Your Game is not available.'
      }
    }

    // check if the games was mobile legend or free fire
    // const isGameHasToCheck = gameHasToCheck.find(v => v.id == game_id);
    if(isGameHasToCheck && isGameHasToCheck.check_username) {
      const resp = await checkUserIdGames(dto);
      if(resp.status == 0) {
        throw {
          message: resp.error_msg
        }
      } else if (!resp.data.is_valid) {
        throw {
          message: resp.message
        }
      }
    }

    let dtoUniplay = {};

    if(isGameHasToCheck && isGameHasToCheck.use_uniplay) {
      // get data first 
      const responseDTU = await getInquiryDTU();
      let choosenGame = responseDTU.list_dtu.find(val => val.name == isGameHasToCheck.title);
      if(!choosenGame){
        throw {
          message: 'Wrong Game.'
        }
      }
      const choosenDenom = choosenGame.denom.find(val => val.package == dto.package); 

      if(!choosenDenom) {
        throw {
          message: 'Wrong Products.'
        }
      }

      if(choosenDenom.price != dto.amount){
        throw {
          message: 'Inputted Wrong Prices!'
        }
      }

      dtoUniplay = {
        entitas_id: choosenGame.id,
        denom_id: choosenDenom.id,
        user_id: dto.user_id,
        server_id: dto.server_id
      };

      isLogicAllPassed = true;
      
    }

    // Hit Cronos
    const resp = await sendCronosGateway({...dto, code});
    dto.transaction_id = resp.responseData.id;

    finalResponse = resp
    
    if(isLogicAllPassed) {
      

      // Hit UniPlay
      const responseUniPlay = await postInquiryPayment(dtoUniplay);
      dto.inquiry_id = responseUniPlay.inquiry_id;
    }

    await Payment.create(dto);

    res.status(200).json({
      status: 'Success',
      message: 'Success Adding Payment!',
      data: finalResponse
    });
  } catch (error) {
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

    let dto = {
      ref_id: ref_id || uuidv4(),
      transaction_id: transaction_id || uuidv4(),
      amount: amount,
      user_id: user_id,
      name: name,
      game_id: game_id,
      nmid: nmid,
      payment_method: payment_method,
      phone_number: phone_number,
      payment_date: null,
      request_date: requested_date,
      payment_status: 'Pending',
      package: package,
      server_id: server_id,
      inquiry_id: null
    };

    let isLogicAllPassed = false;
    let finalResponse = null;

    const isGameHasToCheck = await GamePackage.findOne({where: {
      is_active: true, name: game_id
    }})

    // return console.log(isGameHasToCheck && isGameHasToCheck.check_username,'??')
    if(!isGameHasToCheck) {
      throw {
        message: 'Your Game is not available.'
      }
    }

    // check if the games was mobile legend or free fire
    // const isGameHasToCheck = gameHasToCheck.find(v => v.id == game_id);
    if(isGameHasToCheck && isGameHasToCheck.check_username) {
      const resp = await checkUserIdGames(dto);
      if(resp.status == 0) {
        throw {
          message: resp.error_msg
        }
      } else if (!resp.data.is_valid) {
        throw {
          message: resp.message
        }
      }
    }

    let dtoUniplay = {};

    if(isGameHasToCheck && isGameHasToCheck.use_uniplay) {
      // get data first 
      const responseDTU = await getInquiryDTU();
      let choosenGame = responseDTU.list_dtu.find(val => val.name == isGameHasToCheck.title);
      if(!choosenGame){
        throw {
          message: 'Wrong Game.'
        }
      }
      const choosenDenom = choosenGame.denom.find(val => val.package == dto.package); 

      if(!choosenDenom) {
        throw {
          message: 'Wrong Products.'
        }
      }

      if(choosenDenom.price != dto.amount){
        throw {
          message: 'Inputted Wrong Prices!'
        }
      }

      dtoUniplay = {
        entitas_id: choosenGame.id,
        denom_id: choosenDenom.id,
        user_id: dto.user_id,
        server_id: dto.server_id
      };

      isLogicAllPassed = true;
      
    }

    // Hit Cronos
    const resp = await sendCronosGateway({...dto, code});
    dto.transaction_id = resp.responseData.id;

    finalResponse = resp
    
    if(isLogicAllPassed) {

      // Hit UniPlay
      const responseUniPlay = await postInquiryPayment(dtoUniplay);
      dto.inquiry_id = responseUniPlay.inquiry_id;
    }

    await Payment.create(dto);

    res.status(200).json({
      status: 'Success',
      message: 'Success Adding Payment!',
      data: finalResponse
    });
  } catch (error) {
    console.log(error,'????')

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

    const statusTransactionsCronos = await checkCronosPaymentStatus({ payment_id });
    const payment = await Payment.findOne({
      where: { transaction_id: payment_id }
    });

    if(!payment){
      throw {
        message: 'Your Transactions Doesnt Exist.'
      }
    }

    const isGameHasToCheck = await GamePackage.findOne({where: {
      is_active: true, name: payment.game_id
    }})

     // check if the games was mobile legend or free fire
    //  const isGameHasToCheck = gameHasToCheck.find(v => v.id == payment.game_id);

    if(!isGameHasToCheck) {
      throw {
        message: 'Your Game is not available.'
      }
    }

    if (!payment) {
      return res
        .status(400)
        .send({ status: 'Bad Request', message: 'Payment Not Found' });
      }

    let dto = {
      payment_status: await updatePaymentStatus(statusTransactionsCronos.status)
    };
    if(isGameHasToCheck && isGameHasToCheck.use_uniplay && dto.payment_status == "Success") {
      // GAME UNIPLAY
      await postConfirmPayment({inquiry_id: payment.inquiry_id, pincode: process.env.PINCODE_UNIPIN});
    } else if (isGameHasToCheck && !isGameHasToCheck.use_uniplay && dto.payment_status == "Success") {
      // Hit Amount Coin in Nero Games
      await gameController.incrementCoin(payment.game_id, payment.user_id, payment.amount);
    } else if (dto.payment_status == "Pending" || dto.payment_status == 'Failed') {
      throw {
        message: 'You havent paid.'
      }
    }

    await Payment.update(dto, { where: { transaction_id: payment_id } });
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

    const statusTransactionsCronos = await checkCronosPaymentStatus({ payment_id });
    const payment = await Payment.findOne({
      where: { transaction_id: payment_id }
    });

    if(!payment){
      throw {
        message: 'Your Transactions Doesnt Exist.'
      }
    }

    const isGameHasToCheck = await GamePackage.findOne({where: {
      is_active: true, name: payment.game_id
    }})

     // check if the games was mobile legend or free fire
    //  const isGameHasToCheck = gameHasToCheck.find(v => v.id == payment.game_id);

    if(!isGameHasToCheck) {
      throw {
        message: 'Your Game is not available.'
      }
    }

    if (!payment) {
      return res
        .status(400)
        .send({ status: 'Bad Request', message: 'Payment Not Found' });
      }

    let dto = {
      payment_status: await updatePaymentStatus(statusTransactionsCronos.status)
    };
    if(isGameHasToCheck && isGameHasToCheck.use_uniplay && dto.payment_status == "Success") {
      // GAME UNIPLAY
      await postConfirmPayment({inquiry_id: payment.inquiry_id, pincode: process.env.PINCODE_UNIPIN});
    } else if (isGameHasToCheck && !isGameHasToCheck.use_uniplay && dto.payment_status == "Success") {
      // Create User Random Generate
      const response = await generateRandomUserFunc();

      // Hit Amount Coin in Nero Games
      await gameController.incrementCoin(payment.game_id, response.idUser, payment.amount);
    } else if (dto.payment_status == "Pending" || dto.payment_status == 'Failed') {
      throw {
        message: 'You havent paid.'
      }
    }

    await Payment.update(dto, { where: { transaction_id: payment_id } });
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
    const response = await getInquiryDTU();
    res.status(200).json({ response });
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

    const isUserAvailable = await User.findOne({ where: { username: randomNames } });
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

    return {username: randomNames, idUser, role};
}

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
                callback: `${process.env.REDIRECT_HOST}/confirmation/${object.transaction_id}`,
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
                callback: `${process.env.REDIRECT_HOST}/confirmation/${object.transaction_id}`,
                successRedirectUrl: `${process.env.REDIRECT_HOST}/confirmation/${object.transaction_id}`
              }
            };
            console.log(dto,'dto')

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
          callback: `${process.env.REDIRECT_HOST}/confirmation/${object.transaction_id}`
        }
      };
      console.log(dto,'dto')

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
                callback: `${process.env.REDIRECT_HOST}/confirmation/${object.transaction_id}`
              }
            };

            console.log(dto,'dto')

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
          callback: `${process.env.REDIRECT_HOST}/confirmation/${object.transaction_id}`
        }
      };
      console.log(dto,'dto')

      const response = await cronosEWallet(dto);
      return response;
    } else {
      throw { message: 'Something Wrong with server.' };
    }
  } catch (error) {
    throw error;
  }
};
