const axios = require('axios');
const crypto = require('crypto');

class API {
  static API_URL;
  static SECRET_KEY_TOKEN_CRONOS;
  static SECRET_KEY_CRONOS;

  static initialize() {
    API.API_URL = process.env.CRONOS_BASE_URL;
    API.SECRET_KEY_TOKEN_CRONOS = process.env.SECRET_KEY_TOKEN_CRONOS;
    API.SECRET_KEY_CRONOS = process.env.SECRET_KEY_CRONOS;
  }

  // Get configuration with authorization token
  static getConfig = async () => {
    return {
      headers: {
        'On-Key': API.SECRET_KEY_CRONOS,
        'On-Token': API.SECRET_KEY_TOKEN_CRONOS
        // 'On-Signature':
      }
    };
  };

  // Make a POST request
  static post = async (endpoint, body, customHeaders = {}) => {
    // Ensure the API is initialized
    if (
      !API.API_URL ||
      !API.SECRET_KEY_CRONOS ||
      !API.SECRET_KEY_TOKEN_CRONOS
    ) {
      API.initialize();
    }

    // Step 1: JSON encode the body
    const bodyJson = JSON.stringify(body);

    // Step 2: Concatenate key and JSON-encoded body
    const message = API.SECRET_KEY_CRONOS + bodyJson.replace(/\//g, '\\/');

    // Step 3: Calculate the hash using HMAC-SHA512
    const hmac = crypto.createHmac('sha512', API.SECRET_KEY_TOKEN_CRONOS);
    hmac.update(message);
    const hash = hmac.digest('hex');

    let headers = (await API.getConfig()).headers;
    const config = {
      headers: {
        ...headers,
        "On-Signature": hash,
      },
      maxBodyLength: Infinity,
    };

    const url = `${API.API_URL}${endpoint}`;
    console.log(url,'??')
    try {
      const response = await axios.post(url, body, config);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  };

  // Make a GET request
  static get = async (endpoint, params) => {
    // Ensure the API is initialized
    if (
      !API.API_URL ||
      !API.SECRET_KEY_CRONOS ||
      !API.SECRET_KEY_TOKEN_CRONOS
    ) {
      API.initialize();
    }

    const signature = crypto.createHmac('sha512', API.SECRET_KEY_TOKEN_CRONOS).update(API.SECRET_KEY_CRONOS).digest('hex');

    let headers = (await API.getConfig()).headers;
    const config = {
      headers: {
        ...headers,
        "On-Signature": signature,
      },
      maxBodyLength: Infinity,
    };


    const url = `${API.API_URL}${endpoint}`;
    console.log(url,'??')

    try {
      const response = await axios.get(url, config);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  };
}

module.exports = API;
