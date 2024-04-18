require("dotenv").config();
const sql = require("./db.js");
const uuid = require("uuid");
// const axios = require("axios");
// const BookProvider = require("../providers/users.provider");

class Users {
  constructor(user) {
    this.uid =  uuid.v4() || user.uid  ;
    // this.username = user.username;
    // this.password = user.password;
    // this.role = user.role;
    // this.email = user.email;
    // this.phoneNumber = user.phoneNumber;
    // this.photo = user.photo;
  }

  findOne = async (users) => {
    try {
      const results = await new Promise((resolve, reject) => {
        sql.query(
          /* sql */ `SELECT * FROM absences WHERE status = 1 AND users_id=? AND date_absence =?`,
          [users.user_id, new Date(users.date)],
          (err, res) => {
            if (err) reject(err);
            resolve(res);
          }
        );
      }).then((response) => response);
      return results;
    } catch (error) {
      throw error;
    }
  };

  findAll = async (user) => {
    try {
      const results = await new Promise((resolve, reject) => {
        sql.query(
          /* sql */ `SELECT * FROM absences WHERE status = 1 AND date_absence BETWEEN ? AND ?`,
          [new Date(user.dateFrom), new Date(user.dateTo)],
          (err, res) => {
            if (err) reject(err);
            resolve(res);
          }
        );
      }).then((response) => response);
      return results;
    } catch (error) {
      throw error;
    }
  };

  findByUserIdOnly = async (user) => {
    try {
      const results = await new Promise((resolve, reject) => {
        sql.query(
          /* sql */ `SELECT * FROM absences WHERE status = 1 AND users_id=? AND MONTH(date_absence) = ? `,
          [user.user_id, user.month],
          (err, res) => {
            if (err) reject(err);
            resolve(res);
          }
        );
      }).then((response) => response);
      return results;
    } catch (error) {
      throw error;
    }
  };

  updateOne = async (user, status) => {
    try {
      let dto = [];
      let query = "";
      if (status === "Clocked In") {
        dto = [
          this.uid,
          user.user_id,
          user.clocked_in,
          "",
          new Date(user.date)
        ];

        query =
          "INSERT INTO absences (id, users_id, clocked_in, clocked_out, date_absence) VALUES (?,?,?,?,?) ";
      } else {
        dto = [
          user.clocked_out,
          user.user_id,
          new Date(user.date)
        ];

        query =
          "UPDATE absences SET clocked_out=? WHERE users_id=? AND date_absence =?";
      }

      const results = await new Promise((resolve, reject) => {
        sql.query(/* sql */ query, dto, (err, res) => {
          if (err) reject(err);
          resolve(res);
        });
      }).then((response) => response);
      return results;
    } catch (error) {
      throw error;
    }
  };
}

module.exports = Users;
