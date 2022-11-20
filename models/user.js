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
const { string } = require("@hapi/joi");
const  {serviceSchema}  = require("./ServiceProvider");
var userSchema = mongoose.Schema({




  firstName: String,
  lastName:String,
  email: String,
  
  password: String,

  role: { 
    type: String,
    default: "user",
  },
  resetLink:{
    data:String,
    default:''
  },
  number:{
    type:String,
   // required:true
      },
      id:{
        type: String,
       // default:"aabbcc"
      },
     cart: [
        {
         // product:{type: mongoose.Schema.Types.ObjectId, ref:'services'},
         // name:{type: mongoose.Schema.Types.String, ref:'services'},

         product: serviceSchema,
          quantity: {
            type: Number,
            required: true,
          },
        
        },
      ],
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
module.exports = User;
//module.exports.User = User;
module.exports.validate = validateUser; //for sign up
module.exports.validateUserLogin = validateUserLogin; // for login
/*const mongoose = require("mongoose");
const { serviceSchema } = require("./ServiceProvider");

const userSchema = mongoose.Schema({
  name: {
    required: true,
    type: String,
    trim: true,
  },
  email: {
    required: true,
    type: String,
    trim: true,
    validate: {
      validator: (value) => {
        const re =
          /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
        return value.match(re);
      },
      message: "Please enter a valid email address",
    },
  },
  password: {
    required: true,
    type: String,
  },
  address: {
    type: String,
    default: "",
  },
  type: {
    type: String,
    default: "user",
  },
  cart: [
    {
      product: serviceSchema,
      quantity: {
        type: Number,
        required: true,
      },
    },
  ],
});

const User = mongoose.model("User", userSchema);
module.exports = User;*/
