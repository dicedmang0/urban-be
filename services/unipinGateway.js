const API = require('./moduleAxiosFunc');

exports.getAccessToken = async () => {
  try {
    const response = await API.postUnipin(`/access-token`, {}, null);
    return response;
  } catch (error) {
    throw { message: error.message };
  }
};

exports.getInquirySaldo = async () => {
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

exports.getInquiryDTU = async () => {
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

exports.getInquiryVoucher = async () => {
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
exports.postInquiryPayment = async (dto) => {
  try {
    const responseToken = await this.getAccessToken();
    if(responseToken.status != 200) {
      throw responseToken
    }

    const response = await API.postUnipin(`/inquiry-payment`, dto, responseToken.access_token);
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
    const response = await API.postUnipin(`/confirm-payment`, dto, responseToken.access_token);

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
    return response;
  } catch (error) {
    throw { message: error.message };
  }
};
