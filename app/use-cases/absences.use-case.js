const Users = require("../models/absences.model.js");
const validateRequest = require("../validator/absences.validator.js");

class UseCaseBooks {
  constructor(booksProvider) {
    this.booksProvider = booksProvider;
  }

  findOne = async (dto) => {
    try {
      const retrieveValidRequest = await validateRequest.findAbsencesById(dto);
      const resp = await new Users(retrieveValidRequest).findOne(
        retrieveValidRequest
      );
      return resp;
    } catch (error) {
      throw error;
    }
  };

  updateOne = async (userDetail, dto) => {
    try {
      let retrieveValidRequest = null;
      if (dto.status == "Clocked In") {
        retrieveValidRequest = await validateRequest.ClockedIn(dto);
      } else if (dto.status == "Clocked Out") {
        retrieveValidRequest = await validateRequest.ClockedOut(dto);
      } else {
        throw { message: "Wrong Status!" };
      }

      const isUserAlreadyAbsences = await new Users(
        retrieveValidRequest
      ).findOne({
        user_id: userDetail.idUser,
        date: retrieveValidRequest.date,
      });
      if (isUserAlreadyAbsences.length) {
        if(isUserAlreadyAbsences[0].clocked_in != "" &&  isUserAlreadyAbsences[0].clocked_out != ""){
          throw { message: "You already absence!" };
        }
      }

      const resp = await new Users(retrieveValidRequest).updateOne(
        { ...retrieveValidRequest, user_id: userDetail.idUser },
        dto.status
      );
      return resp;
    } catch (error) {
      throw error;
    }
  };

  findAll = async (dto) => {
    try {
      const retrieveValidRequest = await validateRequest.findAbsencesByDate(
        dto
      );
      const resp = await new Users(retrieveValidRequest).findAll(
        retrieveValidRequest
      );
      return resp;
    } catch (error) {
      throw error;
    }
  };

  findAllByUserName = async (dto) => {
    try {
      const retrieveValidRequest =
        await validateRequest.findAbsencesByUserIdOnly(dto);
      const resp = await new Users(retrieveValidRequest).findByUserIdOnly(
        retrieveValidRequest
      );
      return resp;
    } catch (error) {
      throw error;
    }
  };
}

module.exports = UseCaseBooks;
