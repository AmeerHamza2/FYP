/*const mongoose = require("mongoose");
const Joi = require("@hapi/joi");
const userSchema = mongoose.Schema({
  firstname: String,
  lastname: String,
  
});
const userModel = mongoose.model("channels", userSchema);
function validateProduct(data) {
    const schema = Joi.object({
      firstname: Joi.string().min(3).max(20).required(),
      lastname: Joi.string().min(3).max(20).required(),
      city: Joi.string().min(3).max(20).required(),
      phone: Joi.string().min(11).required(),
    });
    return schema.validate(data, { abortEarly: false });
  }
module.exports = userModel;
module.exports.validate = validateProduct;*/
/*const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
  firstTeam: String,
  secondTeam: String,
  date: Date,
  
});
const ProductModel = mongoose.model("products", productSchema);
module.exports = ProductModel;*/
var mongoose = require("mongoose");
var bcrypt = require("bcryptjs");
const Joi = require("@hapi/joi");
var userSchema = mongoose.Schema({
  name: String,
  email: String,
  password: String,

  role: { 
    type: String,
    default: "admin",
  },
  resetLink:{
    data:String,
    default:''
  },
 
  
});
userSchema.methods.generateHashedPassword = async function () {
  let salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
};
var User = mongoose.model("users", userSchema);

function validateUser(data) {
  const schema = Joi.object({
    name: Joi.string().min(3).max(10).required(),
    email: Joi.string().email().min(3).max(10).required(),
    password: Joi.string().min(3).max(10).required(),
  });
  return schema.validate(data, { abortEarly: false });
}
function validateUserLogin(data) {
  const schema = Joi.object({
    email: Joi.string().email().min(3).max(10).required(),
    password: Joi.string().min(3).max(10).required(),
  });
  return schema.validate(data, { abortEarly: false });
}
module.exports.User = User;
module.exports.validate = validateUser; //for sign up
module.exports.validateUserLogin = validateUserLogin; // for login
