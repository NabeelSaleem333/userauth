const express = require("express");
const nodemailer = require("nodemailer");
const passwordRouter = express.Router();
const User = require("../user-models/user.model");
const OptCode = require("../user-models/code.model");
const func = require("../functions/functions");
/* Task List in User-Auth {password} 
1- Change Password 
{email address, old-password, new-password}
2- Forget-Password
{Verify Email address}
{send 6 digits code to the user email address after verifaction}
3- New password 
{set you new password}
*/
passwordRouter.route("/changepassword").post(async (req, res) => {
  try {
    console.log("Changing user password...", req.body);
    const findUser = await User.findOne({
      email: req.body.email,
      password: req.body.password,
    });
    console.log("Found User", findUser);
    if (findUser) {
      const body = {
        password: req.body.newpassword,
      };
      const updateUser = await User.findByIdAndUpdate(
        findUser._id,
        { $set: body },
        { new: true }
      );
      console.log(updateUser);
      if (updateUser) {
        console.log("User Update successfully...", updateUser);
        res.status = 200;
        res.setHeader("Content-Type", "application/json");
        var transport = nodemailer.createTransport({
          service: "gmail",
          port: 587,
          auth: {
            user: "nabeel.saleem333",
            pass: "christ@777",
          },
        });
        var mailOptions = {
          from: "nabeel.saleem333@gmail.com",
          to: "ns964911@gmail.com",
          subject: "Node.js Test Email",
          text: "Hello to the new email sending programming work",
          html: `<h1>${req.body.email} your new password is ${req.body.newpassword}</h1>`,
        };
        transport.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.log("Error in sending email");
            res.statusCode = 500;
            res.setHeader("Content-Type", "text/plain");
            return res.json(error);
          } else {
            console.log("Email send sucessfully!");
            res.statusCode = 200;
            res.setHeader("Content-Type", "text/plain");

            res.json({ status: "Email send successfully", updateUser });
          }
          //   return res.json(info);
        });
      } else {
        res.status = 404;
        res.setHeader("Content-Type", "application/json");
        res.json({ status: "Password not updated..." });
      }
    }
  } catch (error) {
    return res.status(500).json(error);
  }
});

passwordRouter.route("/verifyemail").post(async (req, res) => {
  try {
    console.log("Request for new password, Verifying email address....");
    const user = await User.findOne({ email: req.body.email });
    console.log("User Email Existence: ", user);
    if (user) {
    const resp = await func.sendEmail(req.body.email);
   setTimeout(() => {
            console.log('in response: ', resp);
        }, 5000);


    //   if (resp) {
        res.status = 200;
        res.setHeader("Content-Type", "application/json");
        return res.json({ status: true, msg: "Email Sent Successfully!" });
    //   }
    } else {
      console.log("invalid user");
      res.status = 404;
      res.setHeader("Content-Type", "application/json");
      res.json({ status: false, msg: "Invalid Email Address" });
    }
  } catch (error) {
    res.status = 500;
    res.setHeader("Content-Type", "application/json");
    res.json(error);
  }
});

/* 
  set new password for the user, If user enter
  the 6 digits code which were send on the user
  email address
  */
passwordRouter.route("/newpassword").post(async (req, res) => {
  try {
    console.log("Request for new password, If user forget it....");
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      console.log("valid user");
      res.status = 200;
      res.setHeader("Content-Type", "application/json");
      res.json({ status: true, msg: "valid user" });
    } else {
      console.log("invalid user");
      res.status = 404;
      res.setHeader("Content-Type", "application/json");
      res.json({ status: false, msg: "Invalid User" });
    }
  } catch (error) {
    res.status = 500;
    res.setHeader("Content-Type", "application/json");
    res.json(error);
  }
});

module.exports = passwordRouter;
