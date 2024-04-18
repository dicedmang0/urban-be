const BookProvider = require("../providers/absences.provider");
const UseCaseUser = require("../use-cases/absences.use-case");

const provider = new BookProvider(process.env.API_LIBRARY);
const UseCase = new UseCaseUser(provider);

exports.updateClocked = async (req, res) => {
  try {
    const response = await UseCase.updateOne(req.app.token, req.body);
    res.status(200).send({
      status: "Success",
      message: "Success",
      data: response,
    });
  } catch (error) {
    res.status(400).send({ status: "Bad Request", message: error.message });
  }
};

exports.findAll = async (req, res) => {
  try {
    let response = await UseCase.findAll(req.body);
    let retrieveUsers = await provider.retrieveUsersList(req.headers['authorization']);

    const userMap = new Map(retrieveUsers.map(user => [user.id, user]));

    const absencesWithUserInfo = response.map(absence => {
      const user = userMap.get(absence.users_id);
      if (user) {
        return {
          ...absence,
          username: user.username,
          photo: user.photo,
          email: user.email,
          phoneNumber: user.phoneNumber,
          position: user.role
        };
      } else {
        return absence; // Return absence object as is if user is not found
      }
    });

    console.log(absencesWithUserInfo,'????')
    res.status(200).send({
      status: "Success",
      message: "Success",
      data: absencesWithUserInfo,
    });
  } catch (error) {
    res.status(400).send({ status: "Bad Request", message: error.message });
  }
};


exports.findAllByUserName = async (req, res) => {
  try {
    const response = await UseCase.findAllByUserName({user_id: req.app.token.idUser, month: req.body.month});
    res.status(200).send({
      status: "Success",
      message: "Success",
      data: response,
    });
  } catch (error) {
    res.status(400).send({ status: "Bad Request", message: error.message });
  }
};

exports.findOne = async (req, res) => {
  try {
    const response = await UseCase.findOne(req.body);
    res.status(200).send({
      status: "Success",
      message: "Success",
      data: response,
    });
  } catch (error) {
    res.status(400).send({ status: "Bad Request", message: error.message });
  }
};
