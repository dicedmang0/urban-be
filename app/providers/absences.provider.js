const axios = require("axios");

class BookProvider {
  constructor(url) {
    this.url = url;
  }

  retrieveUsersList = async (token) => {
    try {
      const response = await axios({
        method: "get",
        url: `${this.url}/retrieve-all-user`,
        headers: {
          "Authorization": token,
          "Content-Type": "application/json",
        },
      });
      return response.data.data;
    } catch (error) {
      throw undefined;
    }
  };
}

module.exports = BookProvider;
