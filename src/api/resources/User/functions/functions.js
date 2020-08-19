const nodemailer = require("nodemailer");
const User = require("../user-models/user.model");
const OptCode = require("../user-models/code.model");

module.exports.sendEmail = async (email) => {
  console.log("Hello am in function file yahooooooooooooooo.");
  /* 
    Generate 6 digit code
    */
  const code = await generateCode(email);
  console.log("code: ", code);
  // const code = 1111111;

  /*
      Generate email and send to the user 
      email adddress
        */
  console.log("Sending Email...");
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
    to: email,
    subject: "Asasa Tech",
    text: "Hello to the new email sending programming work",
    html: `
            <h1>Verificatoin Code</h1>
            <p>Please enter verification code to proceed further</p>
            <p>Code: ${code}</p>`,
  };
  transport.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log("Error in sending email");
      res.json(error);
      //   return ("Error in Email send ");
    } else {
      console.log("Email send sucessfully!");

      res.json({
        status:
          "Please check your email address to enter 6 digit code to proceed further",
      });
      //   return "Please check your email address to enter 6 digit code to proceed further";
    }
    //   return res.json(info);
  });
};

async function generateCode(email) {
  //
  try {
    const optcode = (await OptCode.find()).length;
    console.log("otp code length:" ,optcode);
    if (optcode > 0) {
      const lastcode = await OptCode.findOne().sort({ _id: -1 }).limit(1);
      console.log("last code: ", lastcode);
      // if (lastcode) {
      if ((lastcode.optcode / 2) === 0) {
        console.log('if old code: ', lastcode.optcode);
        const c = parseInt(lastcode.optcode % 2);
        console.log('if parseInt: ',c);
        const code = lastcode.optcode + c ;
        console.log(' if new code: ',code);
        const body = {
          email: email,
          optcode: code,
        };
        const savecode = await OptCode.create(body);
        console.log("Code Saved: ", savecode);
        return code;
      } else {
        console.log('else old code: ', lastcode.optcode);
        const c = parseInt(lastcode.optcode % 2);
        console.log('else parseInt: ',c);
        const code = lastcode.optcode + c ;
        console.log('else new code: ',code);
        const body = {
          email: email,
          optcode: code,
        };
        const savecode = await OptCode.create(body);
        console.log("Code Saved: ", savecode);
        return code;
      }
    } else if (optcode === 0) {
      const gencode = 111111;
      const body = {
        email: email,
        optcode: gencode,
      };
      const savecode = await OptCode.create(body);
      console.log("Code Saved: ", savecode);
      console.log("Gen Code: ",gencode);
      
      if (savecode) {
        return gencode;
      } else {
        return "error in saving code";
      }
    }
  } catch (error) {}
}
