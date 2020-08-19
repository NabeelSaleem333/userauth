const express = require("express");
const nodemailer = require("nodemailer");
const UserRouter = express.Router();
const User = require("./user-models/user.model");
const { find } = require("./user-models/user.model");
const func = require("../User/functions/functions");
/* Task List in User-Auth 
1-SignUp (username,email,password || Mobile Number)
2-Login (email,password || Mobile Number)
3-Forget Password (old password, new password)
*/

/* 
1-SignUp (username,email,password || Mobile Number)
*/
UserRouter.route("/signup").post(async (req, res) => {
  try {
    console.log("Saving user in database");
    const findUser = await User.findOne({ email: req.body.email });
    console.log(findUser);
    if (findUser) {
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.json({ status: false, msg: "Email already exist!" });
    } else {
      const user = await User.create(req.body);
      if (user) {
        func.sendEmail(req.body.email);
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json({
          status: true,
          msg: "Please check your email to enter 6 digit code!",
        });
      } else {
        res.statusCode = 500;
        res.setHeader("Content-Type", "application/json");
        res.json({
          status: true,
          msg: "Internal Server error to save the user information!",
        });
      }
    }
  } catch (error) {
    return res.status(500).json(error);
  }
});

/* 
2-Login (email,password || Mobile Number)
*/
UserRouter.route("/login").post(async (req, res) => {
  try {
    console.log("User is login");
    const findUser = await User.findOne({
      email: req.body.email,
      password: req.body.password,
    });
    console.log(findUser);
    if (findUser) {
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.json(findUser);
    } else {
      res.statusCode = 404;
      res.setHeader("Content-Type", "application/json");
      res.json({ status: "User not found" });
    }
  } catch (error) {
    return res.status(500).json(error);
  }
});

/* 
A admin can get the information of all the user of the system
*/
UserRouter.route("").get(async (req, res) => {
  try {
    const users = await User.find();
    if (users.length > 0) {
      res.status = 200;
      res.setHeader("Content-Type", "application/json");
      res.json(users);
    } else {
      res.status = 404;
      res.setHeader("Content-Type", "application/json");
      res.json({ status: false, msg: "No user exist" });
    }
  } catch (error) {
    res.status = 500;
    res.setHeader("Content-Type", "application/json");
    res.json(error);
  }
});

module.exports = UserRouter;
