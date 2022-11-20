/*const express = require("express");
let router = express.Router ();

router.get("/",async(req,res)=>{
return res.send(["pen","pencil"])
});
module.exports = router;*/
/*const express = require("express");
let router = express.Router();
//get products
router.get("/", async (req, res) => {
  return res.send (["Pen", "Pencil"]);
});
module.exports=router;*/
const express = require("express");
let router = express.Router();
//var {Product} = require("../../models/ServiceProvider");
//var User = require("../../models/user");
//var Order = require("../../models/order");
const  Product = require("../../models/ServiceProvider");
const validateProduct = require("../../middlewares/validateProduct");
const auth = require("../../middlewares/auth");
const admin = require("../../middlewares/admin");
const multer  = require('multer');
const app = require("../../app");
const fs = require("fs");

router.post("/add",  async (req, res) => {
  console.log("hamza");
  try {
    var id="63615fa90d0f53cbd34d78a6"
   // const { id } = req.body;   // get product(service provider) id from front end
    const product = await Product.findById(id);
    
   // const product=await Product.find({idd:req.body.idd})
    console.log(product);
 //  const product = await Product.findById([{63615fa90d0f53cbd34d78a6}]);   // find the service provider based on the id which we get earlier from the front end.
 //  let user = await User.findById(req.user);    // find the specific user based on the id.
 var idd="36931082ccc6957b899bdb7"
 let user = await User.findById(idd); 
 //const user = await User.find({id:req.body.id});      
// console.log(user);
 // let user = await User.findById([{633f12ce8d04833779dd3b59}]); 
    if (user.cart.length == 0) {                 // if user cart lenght is 0.
      user.cart.push({ product, quantity: 1 });  // then pust the default value of 1 in the cart array quntity object.
    } else {                                        // if cart lenght is greater than 0.
      let isProductFound = false;               // take a variable and assign boolean data type(false)
      for (let i = 0; i < user.cart.length; i++) {     // for loop which will exectue cart length times.
        if (user.cart[i].product._id.equals(product._id))
     // if (user.cart[i].product._id.equals(product._id)) {   // if 
          isProductFound = true;
        }
      }

      if (isProductFound) {
        let producttt = user.cart.find((productt) =>
          productt.product._id.equals(product._id)
       // productt.product.idd.equals(product.idd)
        );
        producttt.quantity += 1;
      } else {
        user.cart.push({ product, quantity: 1 });
      }
    }
    user = await user.save();
   // res.json(user);
   res.send(user)
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;