const nodemailer = require("nodemailer");
const User = require("../user-models/user.model");
const OtpCode = require("../user-models/code.model");

module.exports.sendEmail = async (email, callback) => {
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
    //   res.json(error);
        return callback("Error in Email send ");
    } else {
      console.log("Email send sucessfully!");

    //   res.json({
    //     status:
    //       "Please check your email address to enter 6 digit code to proceed further",
    //   });
        return callback("Please check your email address to enter 6 digit code to proceed further");
    }
    //   return res.json(info);
  });
};

async function generateCode(email) {
  //
  try {
    // const otpcode = (await OtpCode.find()).length;
    // console.log("otp code length:" ,otpcode);
    // if (otpcode > 0) {
    //   const lastcode = await OtpCode.findOne().sort({ _id: -1 }).limit(1);
    //   console.log("last code: ", lastcode);
    //   // if (lastcode) {
    //   if ((lastcode.otpcode % 2) === 0) {
    //     console.log('if old code: ', lastcode.otpcode);
    //     const c = parseInt(lastcode.otpcode % 10);
    //     console.log('if parseInt: ',c);
    //     const code = lastcode.otpcode + c ;
    //     console.log(' if new code: ',code);
    //     const body = {
    //       email: email,
    //       otpcode: code,
    //     };
    //     const savecode = await OtpCode.create(body);
    //     console.log("Code Saved: ", savecode);
    //     return code;
    //   } else {
    //     console.log('else old code: ', lastcode.otpcode);
    //     const c = parseInt(lastcode.otpcode % 10);
    //     console.log('else parseInt: ',c);
    //     const code = lastcode.otpcode + c ;
    //     console.log('else new code: ',code);
    //     const body = {
    //       email: email,
    //       otpcode: code,
    //     };
    //     const savecode = await OtpCode.create(body);
    //     console.log("Code Saved: ", savecode);
    //     return code;
    //   }
    // } else if (otpcode === 0) {

    const str = email;
    var gencode = 0;
    console.log('user email in gencode: ',str);
    for(var i=0; i<4; i++){
      if(str.charCodeAt(i) < 60) {
        gencode += (100000 + str.charCodeAt(i) + (str.charCodeAt(i)/2));
      }
      else if(str.charCodeAt(i)> 60 && str.charCodeAt(i)< 100) {
        gencode += (100000 + str.charCodeAt(i) + (str.charCodeAt(i)/3));
      }
      else if(str.charCodeAt(i)> 100) {
        gencode += (100000 + str.charCodeAt(i) + (str.charCodeAt(i)/10));
      }
      console.log(str.charCodeAt(i));
    }
    console.log('new code gencode: ', gencode);

      // const gencode = 111111;
      const body = {
        email: email,
        otpcode: gencode,
      };
      const savecode = await OtpCode.create(body);
      console.log("Code Saved: ", savecode);
      console.log("Gen Code: ",gencode);
      
      if (savecode) {
        return gencode;
      } else {
        return "error in saving code";
      }
    // }
  } catch (error) {}
}
