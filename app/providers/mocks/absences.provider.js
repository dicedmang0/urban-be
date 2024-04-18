const axios = require("axios");

class BookProvider {
  constructor(url) {
    this.url = url;
  }

  retrieveBySubject = async (dto) => {
    try {
      return [
        {
          id: "f1618a58-c423-4618-90c8-4cec741152cc",
          username: "Ade",
          role: "IT",
          email: "ade@gmail.com",
          password: "ade@gmail.com",
          photo: "photo-1713427273064-745492908.jpg",
          phoneNumber: "ade@gmail.com",
          active: 1,
          created_at: "2024-04-17T06:20:36.000Z",
          updated_at: "2024-04-17T06:20:36.000Z",
          deleted_at: "2024-04-17T06:20:36.000Z",
        },
        {
          id: "842b8681-79ca-4c30-a036-8c3750eda5ff",
          username: "Ade2",
          role: "HR",
          email: "ade@gmail.com",
          password: "hehesui",
          photo: "photo-1713366003097-902931070.jpg",
          phoneNumber: "23",
          active: 1,
          created_at: "2024-04-17T06:34:38.000Z",
          updated_at: "2024-04-17T06:34:38.000Z",
          deleted_at: "2024-04-17T06:34:38.000Z",
        },
      ];
    } catch (error) {
      throw undefined;
    }
  };
}

module.exports = BookProvider;
