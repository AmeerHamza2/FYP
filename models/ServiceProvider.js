const mongoose = require("mongoose");
const Joi = require("@hapi/joi");
const { number } = require("@hapi/joi");
const ratingSchema = require("./ratings")
const serviceSchema = mongoose.Schema({
  
  name: {
    type: String,
    required: true,
    //trim: true,
  },
 // category: [String],
 category: {
  type: String,
  required: true,
  //trim: true,
},
price: {
  type: Number,
  //required: true,
},
brandName: {
  type: String,
  required: true,
},
/*idd:{
  type: String,
  
},*/

//   brandInfo : [{
//     brandName : String,
//     brandPrice : String
// }],
 address: {
    type: String,
   // required: true,
    //trim: true,
  },
  ratings: [ratingSchema],
  aver:{
    type:Number,
  },

 // longitude: Number,
  //latitude: Number,
  
//brandInfo:[brandSchema]

  //brandName:String,
 // brandPrice:String,


 // phone: String,
  //city:String,
  
 /* slug: {
    type: String,
   lowercase: true,
  },*/
  image:{
    data:Buffer,
    contentType:String
  },
  quantity: {
    type: Number,
    //required: true,
  },
  
/*{ 
   "name":"taimoor",
    "category":"car wash",
   "brandInfo":[
       {
           "brandName":"toyota",
           "brandPrice":"500"
       },
       {
           "brandName":"hyundai",
           "brandPrice":"300"
       }
   ]

    

}*/

});
const Product = mongoose.model("services", serviceSchema);
function validateProduct(data) {
    const schema = Joi.object({
      firstname: Joi.string().min(3).max(20).required(),
      lastname: Joi.string().min(3).max(20).required(),
      city: Joi.string().min(3).max(20).required(),
      phone: Joi.string().min(11).required(),
    });
    return schema.validate(data, { abortEarly: false });
  }
module.exports = {Product,serviceSchema};
//module.exports = ServiceModel
//module.exports = {}
module.exports.validate = validateProduct;
/*const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
  firstTeam: String,
  secondTeam: String,
  date: Date,
  
});
const ProductModel = mongoose.model("products", productSchema);
module.exports = ProductModel;*/