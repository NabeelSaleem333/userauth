const express = require("express");
const nodemailer = require("nodemailer");
const UserRouter = express.Router();
const User = require("./user-models/user.model");
const { find } = require("./user-models/user.model");
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
      return res.status(200).json({ status: false, msg: "User already Exist" });
    } else {
      var transport = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "nabeel.saleem333",
          pass: "christ@777",
        },
      });
      var mailOptions = {
        from: "nabeel.saleem333@gmail.com",
        to: req.body.email,
        subject: "Node.js Test Email",
        text: "Hello to the new email sending programming work",
        html:
          "<h1>Hello World, Hello to the new email sending programming work</h1>",
      };
      transport.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log("Error in sending email");
          res.statusCode = 404;
          res.setHeader("Content-Type", "application/json");
          return res.json(error);
        } else {
          console.log("Email send sucessfully!");
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");

          const user = User.create(req.body);
          if (user) {
            return res.status(200).json(user);
          } else {
            return res.status(400).json("User not Saved:");
          }
          //   return res.json(info);
        }
      });
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
