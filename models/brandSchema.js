const mongoose = require("mongoose");
const Joi = require("@hapi/joi");
const { number } = require("@hapi/joi");
const { trimEnd } = require("lodash");
const brandSchema = mongoose.Schema({
  
 
  
// brandInfo:[{
//   brandName:String,
//   brandPrice:Number
// }]

brandName: {
  type: String,
  required: true,
 // unique: true,
},

brandPrice: {
  type: Number,
  required: true,
}
  

});
// const ServiceModel = mongoose.model("brand", serviceSchema);

function validateProduct(data) {
    const schema = Joi.object({
      firstname: Joi.string().min(3).max(20).required(),
      lastname: Joi.string().min(3).max(20).required(),
      city: Joi.string().min(3).max(20).required(),
      phone: Joi.string().min(11).required(),
    });
    return schema.validate(data, { abortEarly: false });
  }
module.exports = brandSchema;
module.exports.validate = validateProduct;
/*const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
  firstTeam: String,
  secondTeam: String,
  date: Date,
  
});
const ProductModel = mongoose.model("products", productSchema);
module.exports = ProductModel;*/