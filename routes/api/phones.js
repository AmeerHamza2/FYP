
const express = require("express");
let router = express.Router();
const { Otp } = require("../../models/otpModel");
let { User } = require("../../models/user");
let { Num } = require("../../models/numberModel");

var bcrypt = require("bcryptjs");
const _ = require("lodash");
const jwt = require("jsonwebtoken");
const config = require("config");
const otpGenerator=require('otp-generator');

const accountSid = 'AC27a14bc84564d3e77c4f94d0794baa1b'
const authToken = 'eeaaebf96c01fc6003888e78ddaa3834'
const client = require('twilio')(accountSid, authToken);

// phone number authentication
router.post("/signUp", async (req, res) => {
  const user = await Num.findOne({ number: req.body.number });
  if (user) {
   
 return res.status(400).send("User  already exist");
}else{

  const OTP=otpGenerator.generate(6,{
    digits:true,alphabets:false,upperCaseAlphabets:false,lowerCaseAlphabets:false,specialChars: false,
  });
  const number=req.body.number;
  console.log(OTP);
  client.messages
.create({body:' verification Code send by Ameer Hamza: '+OTP, from: '+12405712487', to: '+923324297542'})
.then(message => console.log(message.sid));
  const otp=new Otp({number:number,otp:OTP});
  const salt=await bcrypt.genSalt(10)
  otp.otp=await bcrypt.hash(otp.otp,salt);
  const result=await otp.save();
  return res.status(200).send("Otp send successfully!!");
}
});

router.post("/verify",async (req,res)=>{
  const otpHolder=await Otp.find({
    number:req.body.number
  });
  console.log(otpHolder.length);
  if(otpHolder.length===0)
  return res.status(400).send("You used an expired OTP");
  const rightOtpFind=otpHolder[otpHolder.length-1];
  console.log(rightOtpFind);
  const validUser=await bcrypt.compare(req.body.otp,rightOtpFind.otp);
if(rightOtpFind.number===req.body.number && validUser){
  const user=new Num(_.pick(req.body,["number"],["password"]))
  await user.generateHashedPassword();

// const users=new User(_.pick(req.body,["number"]))
  let token = jwt.sign(
    { _id: user._id, name: user.number },
    config.get("jwtPrivateKey")
  );
  const result=await user.save();
 // const results=await users.save();
  const OTPDelete=await Otp.deleteMany({
          number:rightOtpFind.number
  });
  return res.status(200).send({
    message:'User Registered Successfullt!!',
    token:token,
    data: result
   
  });
}else{
  return res.status(400).send("Your OTP Was wrong")
}

})


module.exports = router;


                    