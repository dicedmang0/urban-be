const API = require('./moduleAxiosFunc');

exports.getAccessToken = async () => {
  try {
    const response = await API.postUnipin(`/access-token`, {}, null);
    console.log(response,'??')
    return response;
  } catch (error) {
    throw { message: error.message };
  }
};

exports.getInquirySaldo = async (dto, token) => {
  try {
    const responseToken = await this.getAccessToken();
    if(responseToken.status != 200) {
      throw responseToken
    }

    const response = await API.postUnipin(`/inquiry-saldo`, {}, responseToken.access_token);
    return response;
  } catch (error) {
    throw { message: error.message };
  }
};

exports.getInquiryDTU = async (dto, token) => {
  try {
    const responseToken = await this.getAccessToken();
    if(responseToken.status != 200) {
      throw responseToken
    }
    const response = await API.postUnipin(`/inquiry-dtu`, {}, responseToken.access_token);
    return response;
  } catch (error) {
    throw { message: error.message };
  }
};

exports.getInquiryVoucher = async (dto, token) => {
  try {
    const responseToken = await this.getAccessToken();
    if(responseToken.status != 200) {
      throw responseToken
    }
    const response = await API.postUnipin(`/inquiry-voucher`, {}, responseToken.access_token);
    return response;
  } catch (error) {
    throw { message: error.message };
  }
};
exports.getInquiryPayment = async (dto, token) => {
  try {
    const responseToken = await this.getAccessToken();
    if(responseToken.status != 200) {
      throw responseToken
    }

    const sampleBody = {
      entitas_id: 'GET ID FROM INQUIRY DTU / VOUCHER',
      denom_id: 'GET DENOM ID FROM INQUIRY DTU / VOUCHER',
      user_id: 'GAME USER ID (NOT REQUIRED FOR VOUCHER)',
      server_id: 'GAME SERVER ID (NOT REQUIRED FOR VOUCHER)'
    };

    const response = await API.postUnipin(`/inquiry-payment`, dto, responseToken.access_token);
    console.log(response,'???')

    return response;
  } catch (error) {
    throw { message: error.message };
  }
};
exports.postConfirmPayment = async (dto, token) => {
  try {
    const responseToken = await this.getAccessToken();
    if(responseToken.status != 200) {
      throw responseToken
    }
    const sampleBody = {
      inquiry_id: 'GET ID FROM INQUIRY PAYMENT',
      pincode: 'YOUR PINCODE'
    };
    const response = await API.postUnipin(`/confirm-payment`, dto, responseToken.access_token);
    console.log(response,'???')

    return response;
  } catch (error) {
    throw { message: error.message };
  }
};
exports.getCheckOrder = async (dto, token) => {
  try {
    const responseToken = await this.getAccessToken();
    if(responseToken.status != 200) {
      throw responseToken
    }

    const sampleBody = {
      // api_key: 'YOUR API KEY',
      // timestamp: 'YYYY-MM-DD hh:mm:ss',
      order_id: dto.order_id
    };
    const response = await API.postUnipin(`/check-order`, sampleBody, responseToken.access_token);
    console.log(response,'???')
    return response;
  } catch (error) {
    throw { message: error.message };
  }
};
