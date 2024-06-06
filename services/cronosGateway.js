const API = require("./moduleAxiosFunc");
exports.cronosVirtualAccount = async (body) => {
  try {
    const sampleBody = {
      bankCode: "014",
      singleUse: true,
      type: "ClosedAmount",
      reference: "123",
      amount: 10000,
      expiryMinutes: 30,
      viewName: "Mr. Gentur",
      additionalInfo: {
        callback: "http://your-site-callback.com/notify",
      },
    };

    const response = await API.post("/virtual-account", sampleBody);
  } catch (error) {
    throw error;
  }
};

exports.cronosQris = async (body) => {
  try {
    const sampleBody = {
      reference: "TRX0024",
      amount: 10000,
      expiryMinutes: 30,
      viewName: "Gilang",
      additionalInfo: {
        callback: "https://kraken.free.beeceptor.com/notify",
      },
    };

    const response = await API.post("/qris", sampleBody);
  } catch (error) {
    throw error;
  }
};

exports.cronosEWallet = async (body) => {
  try {
    const sampleBody = {
      reference: "123456",
      phoneNumber: "082195395779",
      channel: "ovo",
      amount: 10000,
      expiryMinutes: 30,
      viewName: "Mr. Gentur",
      additionalInfo: {
        callback: "http://your-site-callback.com/notify",
        successRedirectUrl: "http://redirect-after-success.com",
      },
    };

    const response = await API.post("/e-wallet", sampleBody);
  } catch (error) {
    throw error;
  }
};

exports.cronosRetail = async (body) => {
  try {
    const sampleBody = {
      reference: "123456",
      phoneNumber: "082195395779",
      channel: "alfamart",
      amount: 10000,
      expiryMinutes: 30,
      viewName: "Mr. Gentur",
      additionalInfo: {
        callback: "http://your-site-callback.com/notify",
      },
    };

    const response = await API.post("/retail", sampleBody);
  } catch (error) {
    throw error;
  }
};

exports.cronosCreditCard = async (body) => {
  try {
    const sampleBody = {
      reference: "123456",
      phoneNumber: "082195395779",
      amount: 10000,
      expiryMinutes: 30,
      viewName: "Mr. Gentur",
      additionalInfo: {
        callback: "http://your-site-callback.com/notify",
      },
    };

    const response = await API.post("/credit-card", sampleBody);
  } catch (error) {
    throw error;
  }
};

exports.cronosAllTransactions = async (dto) => {
  try {
    const sampleBody = {
      reference: "123456",
      phoneNumber: "082195395779",
      amount: 10000,
      expiryMinutes: 30,
      viewName: "Mr. Gentur",
      additionalInfo: {
        callback: "http://your-site-callback.com/notify",
      },
    };

    const response = await API.get("/transactions?page=1&status=success&date=2023-08-23&type=cashIn");
  } catch (error) {
    throw error;
  }
};

exports.cronosSingleTransactions = async (id) => {
  try {
    const response = await API.get("/check/123?resendCallback=true");
  } catch (error) {
    throw error;
  }
};


