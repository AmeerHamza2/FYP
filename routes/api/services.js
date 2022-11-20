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

//const Product = require("../../models/ServiceProvider");
var User = require("../../models/user");
const Order= require("../../models/order");
const  {Product} = require("../../models/ServiceProvider");
const validateProduct = require("../../middlewares/validateProduct");
const auth = require("../../middlewares/auth");
const admin = require("../../middlewares/admin");
const multer  = require('multer');
const app = require("../../app");
const fs = require("fs");
const { ObjectID } = require('mongodb');
const { sum } = require("lodash");

const accountSid = 'AC27a14bc84564d3e77c4f94d0794baa1b'
const authToken = '7c24e076c90c69d2efa5115aa13c4638'
const client = require('twilio')(accountSid, authToken);
// taimoor
/*router.post("/add-to-cart",  async (req, res) => {
  try {
    console.log("ameer hamza");
    const { id } = req.body; // get product(service provider) id from front end
    let product = await Product.findById(id);     
 //   console.log({product}); // find the service provider based on the id which we get earlier from the front end.
    let user = await User.findById(req.user);
  // let user = await User.findById(new ObjectID("633f146d35842d75301994d0")); 
//user.cart=[]
    if (user.cart.length == 0) {
      user.cart.push({ product, quantity: 1 });
    } else {
      let isProductFound = false;
      for (let i = 0; i < user.cart.length; i++) {
        if (user.cart[i].product._id.equals(product._id)) {
          isProductFound = true;
        }
      }

      if (isProductFound) {
        let producttt = user.cart.find((productt) =>
          productt.product._id.equals(product._id)
        );
        producttt.quantity += 1;
      } else {
        user.cart.push({ product, quantity: 1 });
      }
    }
    user = await user.save();
    res.json(user);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});*/
router.post("/add-to-cart/:id",  async (req, res) => {
  try {
    console.log("ameer hamza");
   // const { id } = req.body; // get product(service provider) id from front end
    let product = await Product.findById(req.params.id);     
    console.log({product}); // find the service provider based on the id which we get earlier from the front end.
   // let user = await User.findById(req.user);
   let user = await User.findById(new ObjectID("633f146d35842d75301994d0")); 
//user.cart=[]
    if (user.cart.length == 0) {
      user.cart.push({ product, quantity: 1 });
    } else {
      let isProductFound = false;
      for (let i = 0; i < user.cart.length; i++) {
        if (user.cart[i].product._id.equals(product._id)) {
          isProductFound = true;
        }
      }

      if (isProductFound) {
        let producttt = user.cart.find((productt) =>
          productt.product._id.equals(product._id)
        );
        producttt.quantity += 1;
      } else {
        user.cart.push({ product, quantity: 1 });
      }
    }
    user = await user.save();
    res.json(user);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});
// remove from cart
/*router.delete("/remove-from-cart/:id", async (req, res) => {
  try {
   // const { id } = req.params;
   // const product = await Product.findById(id);
   // let user = await User.findById(req.user);
   let product = await Product.findById(req.params.id);     
   console.log({product}); // find the service provider based on the id which we get earlier from the front end.
  // let user = await User.findById(req.user);
  let user = await User.findById(new ObjectID("633f146d35842d75301994d0")); 


    for (let i = 0; i < user.cart.length; i++) {
      if (user.cart[i].product._id.equals(cart[i].product._id)) {
        if (user.cart[i].quantity == 1) {
          user.cart.splice(i, 1);
        } else {
          user.cart[i].quantity -= 1;
        }
      }
    }
    user = await user.save();
    res.json(user);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});*/
router.delete("/remove-from-cart/:id",  async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    let user = await User.findById(new ObjectID("633f146d35842d75301994d0"));

    for (let i = 0; i < user.cart.length; i++) {
      if (user.cart[i].product._id.equals(product._id)) {
      //  if (user.cart[i].quantity == 1) {
          user.cart.splice(i, 1);    // delete all cart array.
        //} else {
          //user.cart[i].quantity -= 1;
        //}
      }
    }
    user = await user.save();
    res.json(user);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});
// order product
router.post("/order",  async (req, res) => {
  try {
    const { cart, totalPrice, address } = req.body;
    let products = [];
console.log(cart.length);

    for (let i = 0; i < cart.length; i++) {
     // let product = await Product.findById(cart[i].product._id);
     let product = await Product.findById(new ObjectID("636be970d6bb3daa6533ffb3"));
     console.log(cart[i].quantity);
      console.log(product);
     
//console.log(cart[i]._id)
      if (product.quantity >= cart[i].quantity) {
        product.quantity -= cart[i].quantity;
        products.push({ product, quantity: cart[i].quantity });
        await product.save();
      } else {
        return res
          .status(400)
          .json({ msg: `${product.name} is out of stock!` });
      }
    }

   // let user = await User.findById(req.user);
   //let products = [];
   let user = await User.findById(new ObjectID("633f12ce8d04833779dd3b59"));
    user.cart = [];
    //products=[user.cart]
    user = await user.save();
    client.messages
    .create({body:'Thank you for choosing our Service. Your order has been placed Successfully.', from: '+12405712487', to: '+923324297542'})
    .then(message => console.log(message.sid));
    let order = new Order({
      products,
      totalPrice,
      address,
      userId: req.params.id,
      orderedAt: new Date().getTime(),
    });
   
    order = await order.save();
    res.json(order);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});
// rate a service provider
router.post("/rate-product/:id",  async (req, res) => {
  try {
   // const { id, rating } = req.body;
   const {  rating } = req.body;
   let average=0;
   let aver;
   let avera=0;
   // let product = await Product.findById(id);
   let product = await Product.findById(new ObjectID("636951ccba2f209f4a0839df"));
   console.log(product);
   //console.log(product.ratings.length);
   //console.log(product.ratings[0].rating);
   //console.log(product.ratings[1].rating);
  // console.log(product.ratings[2].rating);
 //  console.log(product.ratings[3].rating);
 //  console.log(product.ratings[4].rating);
    for (let i = 0; i < product.ratings.length; i++) {  // ya is lya ha taka koi 1 user 2 bari na rate kar saka.agr kara ga bhi to second rating sa first wali replace ho jai gi.
    //  if (product.ratings[i].userId == req.user) {
      
      if (product.ratings[i].userId == req.params.id) {
        product.ratings.splice(i, 1);
        break;
      }
    }
   // console.log(product.ratings[1].rating);
    
   for (let i = 0; i < product.ratings.length; i++) {  // ya is lya ha taka koi 1 user 2 bari na rate kar saka.agr kara ga bhi to second rating sa first wali replace ho jai gi.
      
    average=average+product.ratings[i].rating;
   
  
   
  }
  console.log(average);
  aver=average/product.ratings.length;
     
      console.log(aver);
    const ratingSchema = {
      userId: req.params.id,
      rating,
     
      
    };
    if(isNaN(aver)){
    product.aver=avera;
    }
    else{
      product.aver=aver;
    }
   
    product.ratings.push(ratingSchema);

    product = await product.save();
    res.json(product);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});
router.get("/deal-of-day",  async (req, res) => {
  try {
    let products = await Product.find({});

    products = products.sort((a, b) => {
      let aSum = 0;
      let bSum = 0;

      for (let i = 0; i < a.ratings.length; i++) {
        aSum += a.ratings[i].rating;
      }

      for (let i = 0; i < b.ratings.length; i++) {
        bSum += b.ratings[i].rating;
      }
      return aSum < bSum ? 1 : -1;
    });

    res.json(products[0]);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

/*router.post("/add-to-cart",  async (req, res) => {
  try {
    console.log("ameer hamza");
   // const { id } = req.body;
    //const product = await Product.findById(id);
    //let user = await User.findById(req.user);
  //  var id='63615fa90d0f53cbd34d78a6'
    // const { id } = req.body;   // get product(service provider) id from front end
  //   const product = await Product.findById()
//  const product = await Product.find({idd:req.body.idd})
  let product = await Product.find({name:req.body.name})
  console.log("ameer hamza");
    // var idd="36931082ccc6957b899bdb7"
    // let user = await User.findById(); 
    let user = await User.findById({id:req.body.id}); 
    if (user.cart.length == 0) {
      user.cart.push({ product, quantity: 1 });
    } else {
      let isProductFound = false;
      for (let i = 0; i < user.cart.length; i++) {
        if (user.cart[i].product._id.equals(product._id)) {
          isProductFound = true;
        }
      }

      if (isProductFound) {
        let producttt = user.cart.find((productt) =>
          productt.product._id.equals(product._id)
        );
        producttt.quantity += 1;
      } else {
        user.cart.push({ product, quantity: 1 });
      }
    }
    user = await user.save();
    res.json(user);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});*/


//Insert a Sservice provider
router.post("/serPro", async (req, res) => {
  try {
    const { name, category,brandInfo } = req.body;
    let product = new Product({
      name,
      category,
      brandInfo,
      
    });
    product = await product.save();
    res.json(product);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});
// get service providers
// router.get("/getSer",  async (req, res) => {
//  let brandName = req.body.brandName;
//   const result = await Product.aggregate([
//     { $match: {category: req.body.category}},
//     {$unwind: '$brandInfo'},
//     {$match: {'brandInfo.brandName': brandName}},
//     {$group: {name: '$name', category: '$category', brandInfo: {$push: '$brandInfo.brandName'}}}

//   ]);

//   res.send(result);
// });
router.get("/getSer", async (req, res) => {
  // console.log(req.user);
 // const {brandName} = req.body
  /* let page = Number(req.query.page ? req.query.page : 1);
   let perPage = Number(req.query.perPage ? req.query.perPage : 10);
   let skipRecords = perPage * (page - 1);*/
  // console.log(brandInfo);
  const {brandName}=req.body
   let products = await Product.find({ brandInfo:{$elemMatch:{brandName:req.body.brandName}}});
    console.log(products.length);
    console.log(Object.keys(products).length);
    console.log(Object.keys(brandName).length);
// console.log(JSON.stringify(products, null, 4));
   //console.log(Object.keys(brandInfo).length);
  //  for (let i=0;i<Object.keys(products.brandInfo).length;i++){
   /* for (let i=0;i<Object.keys(products).length;i++){
                if(products.brandInfo[i].brandName=brandName){
                  products.brandInfo.splice(i,i+1);
                  break;
                }

                
    }*/
    /*for (let i=0;i<Object.keys(brandName).length;i++){
      if(brandName[i]=brandName){
        brandName.splice(i,i+1);
        break;
      }
    }*/
    /*brandInfo:{
      brandName:req.body.brandName
    }*/
   
   
  
  //.project({"brandInfo.brandName":req.body.brandName}).clone()
   return res.json (products);
 }); 
/*router.post("/serPro", async (req, res) => {
  let product = new Product();
  product.name=req.body.name
  product.category=req.body.category
 // product.brandName=req.body.brandName
  //product.brandPrice=req.body.brandPrice
  product.brandInfo=[{
    brandName:req.body.brandName,
    brandPrice:req.body.brandPrice,
    }]
  await product.save();
  return res.send(product);
});*/

// storage
/*const Storage=multer.diskStorage({
  destination:"uploads",
  filename:(req,file,cb)=>{
    cb(null,file.originalname);
  },
});
const upload= multer({
  storage:Storage
}).single('testImage')


// image upload
router.post("/upload",(req,res)=>{
  upload(req,res,(err)=>{
if(err){
  console.log(err);

}else{
  const newImage =new Product({
    
    firstname:req.body.firstname,
    lastname:req.body.lastname,
  city:req.body.city,
    phone:req.body.phone,
  
    image:{
      data:req.file.filename,
     // data:fs.readFileSync("uploads/",req.file.filename),
      contentType:"image/png",
    }
  })
  newImage.save()
  .then(()=>res.send("successfully Uploaded"))
  .catch(err=>console.log(err));
}
  })
})
*/
const storage=multer.diskStorage({
  destination:(req,file,cb)=>{
    cb(null,'uploads')
  },
  filename:(req,file,cb)=>{
    cb(null,file.originalname)
  }

})

const upload=multer({storage:storage})

// insert a service provider
/*router.post("/serPro",upload.single("testImage"), async (req, res) => {
  try {
    //const { name,category,image } = req.body;
    let product = new Product({
     // name,
      //category,
      name:req.body.name,
      category:req.body.category,
      image: {
        data: fs.readFileSync("uploads/" + req.file.originalname),
        contentType: "image/png",
        },
    });
    product = await product.save();
    res.json(product);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});*/
// insert a sevvice provider
router.post("/upload",upload.single("testImage"),(req, res) => {
	const saveImage = Product({
  //   firstname:req.body.firstname,
  //   lastname:req.body.lastname,
  // city:req.body.city,
  //   phone:req.body.phone,
  name:req.body.name,
  price:req.body.price,
  category:req.body.category,
  address:req.body.address,
  brandName:req.body.brandName,
 
  image: {
	data: fs.readFileSync("uploads/" + req.file.originalname),
	contentType: "image/png",
	},
 idd:req.body.idd,
 quantity:req.body.quantity
	});
	saveImage
	.save()
	.then((res) => {
	console.log("image is saved");
	})
	.catch((err) => {
	console.log(err, "error has occur");
	});
	res.send('image is saved')
	});
/*router.post("/serPro", upload.single("testImage"), (req, res) => {
	const saveImage = Product({
    name:req.body.name,
    category:req.body.category,
 image: {
	data: fs.readFileSync("uploads/" + req.file.originalname),
	contentType: "image/png",
	},
	});
	saveImage
	.save()
	.then((res) => {
	console.log("image is saved");
	})
	.catch((err) => {
	console.log(err, "error has occur");
	});
	res.send('image is saved')
	});*/
//Insert a record
/*router.post("/upload", upload.single("testImage"), (req, res) => {
	const saveImage = Product({
    firstname:req.body.firstname,
    lastname:req.body.lastname,
  city:req.body.city,
    phone:req.body.phone,
  
	image: {
	data: fs.readFileSync("uploads/" + req.file.originalname),
	contentType: "image/png",
	},
	});
	saveImage
	.save()
	.then((res) => {
	console.log("image is saved");
	})
	.catch((err) => {
	console.log(err, "error has occur");
	});
	res.send('image is saved')
	});*/
 /* router.put("/:id", upload.single("testImage"), (req, res) => {
     saveImage=Product.findById(req.params.id)
    const  saveImage = Product({
      firstname:req.body.firstname,
      lastname:req.body.lastname,
    city:req.body.city,
      phone:req.body.phone,
    
    image: {
    data: fs.readFileSync("uploads/" + req.file.originalname),
    contentType: "image/png",
    },
    });
    saveImage
    .save()
    .then((res) => {
    console.log("image is saved");
    })
    .catch((err) => {
    console.log(err, "error has occur");
    });
    res.send('image is saved')
    });*/
//get products
/*router.get("/", async (req, res) => {
  console.log(req.user);
  let page = Number(req.query.page ? req.query.page : 1);
  let perPage = Number(req.query.perPage ? req.query.perPage : 10);
  let skipRecords = perPage * (page - 1);
  let products = await Product.find().skip(skipRecords).limit(perPage);
  return res.send (products);
}); */

// get service provider
router.get("/getPro", async (req, res) => {
  // console.log(req.user);
  /* let page = Number(req.query.page ? req.query.page : 1);
   let perPage = Number(req.query.perPage ? req.query.perPage : 10);
   let skipRecords = perPage * (page - 1);*/
   let products = await Product.find({category:req.body.category})
   return res.json (products);
 }); 
router.get("/", async (req, res) => {
 // console.log(req.user);
 /* let page = Number(req.query.page ? req.query.page : 1);
  let perPage = Number(req.query.perPage ? req.query.perPage : 10);
  let skipRecords = perPage * (page - 1);*/
  let products = await Product.find()
  return res.json (products);
}); 
//get single products
router.get("/:id", async (req, res) => {
  try {
    let product = await Product.findById(req.params.id);
    if (!product)
      return res.status(400).send("Product With given ID is not present"); //when id is not present id db
    return res.send(product); //everything is ok
  } catch (err) {
    return res.status(400).send("Invalid ID"); // format of id is not correct
  }
});
//update a record
/*router.put("/:id",  async (req, res) => {
  let product = await Product.findById(req.params.id);
  //product.name = req.body.name;
 // product.price = req.body.price;
  product.firstname=req.body.firstname
  product.lastname=req.body.lastname
  product.city=req.body.city
  product.phone=req.body.phone

  await product.save();
  return res.send(product);
});*/

//update a record with image
/*router.put("/:id",upload.single("testImage"),  async (req, res) => {
  let product = await Product.findById(req.params.id);
  
    product.firstname=req.body.firstname,
    product.lastname=req.body.lastname,
  product.city=req.body.city,
    product.phone=req.body.phone,
  
	product.image={
	data: fs.readFileSync("uploads/" + req.file.filename),
	contentType:"image/png",
  }
	
	product
	.save()
	.then((res) => {
	console.log("image is saved");
	})
	.catch((err) => {
	console.log(err, "error has occur");
	});
	res.send('image is saved')
  //product.name = req.body.name;
 // product.price = req.body.price;
  product.firstname=req.body.firstname
  product.lastname=req.body.lastname
  product.city=req.body.city
  product.phone=req.body.phone

  await product.save();
  return res.send(product);
});*/
//Delete a record
router.delete("/:id",
 async (req, res) => {
  let product = await Product.findByIdAndDelete(req.params.id);
  return res.send(product);
});
//Insert a record
router.post("/", async (req, res) => {
  let product = new Product();
  product.firstname=req.body.firstname
  product.lastname=req.body.lastname
  product.city=req.body.city
  product.phone=req.body.phone
  await product.save();
  return res.send(product);
});
module.exports = router;