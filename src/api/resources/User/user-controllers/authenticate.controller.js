const httpstatus = require("http-status-codes");
const passwordhash = require('password-hash');
//
const User = require("../user-models/user.model");
const func = require("../functions/sendemail");
const auth = require("../../../../config/auth");

/* 
2-Login (email,password || Mobile Number)
*/
exports.authenticate = async (req, res) => {
  try {
    console.log("User is login");
    if (Object.keys(req.body).length === 0) {
      console.log("Object are missing");
      return res.status(httpstatus.BAD_REQUEST).json({
        success: false,
        status: `Your request body is empty ${req.body}`,
      });
    } else {
      /* 
          Conditions to verify that
          {email,password} are not empty
          */
      if (!req.body.email) {
        return res.status(httpstatus.BAD_REQUEST).json({
          success: false,
          status: `Please enter email`,
        });
      }
      if (!req.body.password) {
        return res.status(httpstatus.BAD_REQUEST).json({
          success: false,
          status: `Please enter password`,
        });
      }

      const findUser = await User.findOne(
        {
          email: req.body.email,
        }
      );
      var verifypassword = passwordhash.verify(req.body.password, findUser.password);

      console.log(verifypassword,findUser);
      if (findUser && verifypassword) {
        const token = auth.getToken({ _id: findUser._id });
        return res
          .status(httpstatus.ACCEPTED)
          .json({ success: true, token: token, status: "Logged in success!" });
      } else if (!findUser || !verifypassword) {
      return res.status(httpstatus.BAD_REQUEST).json({ success: false, status: "Invalid Email or Password" });
      }
    }
  } catch (error) {
    return res.status(httpstatus.INTERNAL_SERVER_ERROR).json(error);
  }
};