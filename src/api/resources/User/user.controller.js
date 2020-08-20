const express = require("express");
const UserRouter = express.Router();
const User = require("./user-models/user.model");
const OtpCode = require('./user-models/code.model');
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
    if (Object.keys(req.body).length === 0) {
      console.log("Object are missing");
      res.statusCode = 404;
      res.setHeader("Content-Type", "application/json");
      res.json({
        status: false,
        msg: `Your request body is empty ${req.body}`,
      });
    } else {
      /* 
        Conditions to verify that
        {username,email,password} are not empty
        */
      if (!req.body.username) {
        res.statusCode = 404;
        res.setHeader("Content-Type", "application/json");
        res.json({
          msg: `Please enter username`,
        });
      }
      if (!req.body.email) {
        res.statusCode = 404;
        res.setHeader("Content-Type", "application/json");
        res.json({
          msg: `Please enter email`,
        });
      }
      if (!req.body.password) {
        res.statusCode = 404;
        res.setHeader("Content-Type", "application/json");
        res.json({
          msg: `Please enter password`,
        });
      }

      console.log("Saving user in database", req.body);
      const findUser = await User.findOne({ email: req.body.email });
      console.log("Email exist in database:", findUser);
      if (findUser) {
        console.log("Email exist in database:", findUser);
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json({
          status: false,
          msg: "Email already in use, try wiht another email!",
        });
      } else {
        const user = await User.create(req.body);
        if (user) {
          const val = func.sendEmail(req.body.email);
          console.log(val);
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json({
            status: true,
            msg: "Please check your email to enter 6 digit code!",
          });
        } else {
          console.log("Email exist in database:", findUser);
          res.statusCode = 500;
          res.setHeader("Content-Type", "application/json");
          res.json({
            status: true,
            msg: "Internal Server error to save the user information!",
          });
        }
      }
    }
  } catch (error) {
    return res.status(500).json(error);
  }
});

/* *************************************** */
/* 
  set new password for the user, If user enter
  the 6 digits code which were send on the user
  email address
  */
UserRouter.route("/verifyemail").post(async (req, res) => {
  console.log("Verification of email address after signup using otpcode...");
  try {
    if (Object.keys(req.body).length === 0) {
      res.status = 200;
      res.setHeader("Content-Type", "application/json");
      return res.json({ status: true, msg: "Please provide email address!" });
    } else {
      const user = await User.findOne({ email: req.body.email });
      console.log("signup verification, user details: ", user);
      if (user) {
        const otpcode = await OtpCode.findOne({
          email: req.body.email,
          otpcode: req.body.otpcode,
        });
        if (!otpcode) {
          res.status = 404;
          res.setHeader("Content-Type", "application/json");
          res.json({
            status: true,
            msg: "Invalid code, please enter valid code",
          });
        } else {
          const removeotpcode = await OtpCode.findByIdAndRemove(otpcode._id);
          console.log(
            "otpcode removed after password updation: ",
            removeotpcode
          );
          res.status = 200;
          res.setHeader("Content-Type", "application/json");
          res.json({ status: true, msg: "Email Verified Successfully!" });
        }
      } else {
        console.log("Invalid email address");
        res.status = 404;
        res.setHeader("Content-Type", "application/json");
        res.json({ status: false, msg: "Invalid email address" });
      }
    }
  } catch (error) {
    res.status = 500;
    res.setHeader("Content-Type", "application/json");
    res.json(error);
  }
});
/* ************************************** */

/* 
2-Login (email,password || Mobile Number)
*/
UserRouter.route("/login").post(async (req, res) => {
  try {
    console.log("User is login");
    if (Object.keys(req.body).length === 0) {
      console.log("Object are missing");
      res.statusCode = 404;
      res.setHeader("Content-Type", "application/json");
      res.json({
        status: false,
        msg: `Your request body is empty ${req.body}`,
      });
    } else {
      /* 
        Conditions to verify that
        {email,password} are not empty
        */
      if (!req.body.email) {
        res.statusCode = 404;
        res.setHeader("Content-Type", "application/json");
        res.json({
          msg: `Please enter email`,
        });
      }
      if (!req.body.password) {
        res.statusCode = 404;
        res.setHeader("Content-Type", "application/json");
        res.json({
          msg: `Please enter password`,
        });
      }

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
