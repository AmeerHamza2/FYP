const mongoose = require("mongoose");
const { serviceSchema } = require("./ServiceProvider");
//const ratingSchema = require("./ratings")
const orderSchema = mongoose.Schema({
  products: [
    {
      product: serviceSchema,
    // product:{type: mongoose.Schema.Types.ObjectId, ref:'services'},
      quantity: {
        type: Number,
      //  required: true,
      },
    },
  ],
  totalPrice: {
    type: Number,
   required: true,
  },
  address: {
    type: String,
   // required: true,
  },
  userId: {
   // required: true,
   type: String,
  },
  orderedAt: {
    type: Number,
    required: true,
  },
  status: {
    type: Number,
    default: 0,
  },
  
});

const Order = mongoose.model("orders", orderSchema);
//module.exports = {Order,orderSchema};
module.exports = Order;