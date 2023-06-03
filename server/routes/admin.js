const express = require("express");
const router = express.Router();
const categoryModel = require("../models/categories");
const productModel = require("../models/products");
const pincodeModel = require("../models/pincode");
const sponsorModel = require("../models/sponsor");
const customizeModel = require("../models/customize");
const infoModel = require("../models/info");
const userModel = require("../models/users");
const orderModel = require("../models/orders");
// const ordersController = require("../controller/orders");

router.get('/',async (req,res) => {
    const info = await infoModel.find({_id: "edit"});
    let userid = req.cookies.userid;
    if(userid){
        let verify = await userModel.find({_id: userid})
        if(verify.length > 0){
            if(verify[0].userRole !== 0){
                res.redirect("/")
            }
        }else{
            res.redirect("/")
        }
    }else{
        res.redirect("/")
    }
    res.render("admin.ejs", {info: info[0]});
})

router.get('/product-view',async(req,res)=>{
    let Qtyalert = await productModel
        .find({quantity: {$lt:5}})
    console.log(Qtyalert);
    let Products = await productModel
        .find({})
        .populate("category", "_id cName")
        .sort({ _id: -1 });
    let userid = req.cookies.userid;
    if(userid){
        let verify = await userModel.find({_id: userid})
        if(verify.length > 0){
            if(verify[0].userRole !== 0){
                res.redirect("/")
            }
        }else{
            res.redirect("/")
        }
    }else{
        res.redirect("/")
    }
    res.render("product/product_view.ejs", {products: Products,qtyalerts:Qtyalert});
})

router.get('/product-add',async(req,res)=>{
    let Categories = await categoryModel.find({}).sort({ _id: -1 });
    let userid = req.cookies.userid;
    if(userid){
        let verify = await userModel.find({_id: userid})
        if(verify.length > 0){
            if(verify[0].userRole !== 0){
                res.redirect("/")
            }
        }else{
            res.redirect("/")
        }
    }else{
        res.redirect("/")
    }
    res.render("product/products_add.ejs", {categories: Categories});
})

router.get('/product-edit/:id',async(req,res)=>{
    let id = req.params.id
    let singleProduct = await productModel
          .findById(id)
          .populate("category", "_id cName")
          .populate("pRatingsReviews.user", "name email userImage");
    let userid = req.cookies.userid;
    if(userid){
        let verify = await userModel.find({_id: userid})
        if(verify.length > 0){
            if(verify[0].userRole !== 0){
                res.redirect("/")
            }
        }else{
            res.redirect("/")
        }
    }else{
        res.redirect("/")
    }
    res.render("product/products_edit.ejs", {prod: singleProduct });
})

router.get('/category-view',async(req,res)=>{
    let Categories = await categoryModel.find({}).sort({ _id: -1 });
    let userid = req.cookies.userid;
    if(userid){
        let verify = await userModel.find({_id: userid})
        if(verify.length > 0){
            if(verify[0].userRole !== 0){
                res.redirect("/")
            }
        }else{
            res.redirect("/")
        }
    }else{
        res.redirect("/")
    }
    res.render("category/category_view.ejs", {categories: Categories});
})

router.get('/category-add',async(req,res)=>{
    let userid = req.cookies.userid;
    if(userid){
        let verify = await userModel.find({_id: userid})
        if(verify.length > 0){
            if(verify[0].userRole !== 0){
                res.redirect("/")
            }
        }else{
            res.redirect("/")
        }
    }else{
        res.redirect("/")
    }
    res.render("category/category_add.ejs");
})

router.get('/category-edit/:id',async(req,res)=>{
    let userid = req.cookies.userid;
    if(userid){
        let verify = await userModel.find({_id: userid})
        if(verify.length > 0){
            if(verify[0].userRole !== 0){
                res.redirect("/")
            }
        }else{
            res.redirect("/")
        }
    }else{
        res.redirect("/")
    }
    let id = req.params.id
    let singleCat = await categoryModel.findById(id);
    res.render("category/category_edit.ejs", {cat: singleCat });
})

router.get("/pincode-view", async(req,res)=>{
    let userid = req.cookies.userid;
    if(userid){
        let verify = await userModel.find({_id: userid})
        if(verify.length > 0){
            if(verify[0].userRole !== 0){
                res.redirect("/")
            }
        }else{
            res.redirect("/")
        }
    }else{
        res.redirect("/")
    }
    let Pincodes = await pincodeModel.find({}).sort({ _id: -1 });
    res.render("pincode/pincode-view.ejs", {pincodes: Pincodes });
})

router.get('/pincode-add',async(req,res)=>{
    let userid = req.cookies.userid;
    if(userid){
        let verify = await userModel.find({_id: userid})
        if(verify.length > 0){
            if(verify[0].userRole !== 0){
                res.redirect("/")
            }
        }else{
            res.redirect("/")
        }
    }else{
        res.redirect("/")
    }
    res.render("pincode/pincode-add.ejs");
})

router.get('/pincode-edit/:id',async(req,res)=>{
    let userid = req.cookies.userid;
    if(userid){
        let verify = await userModel.find({_id: userid})
        if(verify.length > 0){
            if(verify[0].userRole !== 0){
                res.redirect("/")
            }
        }else{
            res.redirect("/")
        }
    }else{
        res.redirect("/")
    }
    let id = req.params.id
    let pincode = await pincodeModel.findById(id);
    res.render("pincode/pincode-edit.ejs", {pincode: pincode });
})

router.get("/sponsor-view", async(req,res)=>{
    let userid = req.cookies.userid;
    if(userid){
        let verify = await userModel.find({_id: userid})
        if(verify.length > 0){
            if(verify[0].userRole !== 0){
                res.redirect("/")
            }
        }else{
            res.redirect("/")
        }
    }else{
        res.redirect("/")
    }
    let sponsor = await sponsorModel.find({}).sort({ _id: -1 });
    res.render("sponsor/sponsor-view.ejs", {sponsors: sponsor });
})

router.get('/sponsor-add',async(req,res)=>{
    let userid = req.cookies.userid;
    if(userid){
        let verify = await userModel.find({_id: userid})
        if(verify.length > 0){
            if(verify[0].userRole !== 0){
                res.redirect("/")
            }
        }else{
            res.redirect("/")
        }
    }else{
        res.redirect("/")
    }
    res.render("sponsor/sponsor-add.ejs");
})

router.get('/sponsor-edit/:id',async(req,res)=>{
    let userid = req.cookies.userid;
    if(userid){
        let verify = await userModel.find({_id: userid})
        if(verify.length > 0){
            if(verify[0].userRole !== 0){
                res.redirect("/")
            }
        }else{
            res.redirect("/")
        }
    }else{
        res.redirect("/")
    }
    let id = req.params.id
    let sponsor = await sponsorModel.findById(id);
    res.render("sponsor/sponsor-edit.ejs", {sponsor: sponsor });
})

router.get("/slider-view", async(req,res)=>{
    let userid = req.cookies.userid;
    if(userid){
        let verify = await userModel.find({_id: userid})
        if(verify.length > 0){
            if(verify[0].userRole !== 0){
                res.redirect("/")
            }
        }else{
            res.redirect("/")
        }
    }else{
        res.redirect("/")
    }
    let sliders = await customizeModel.find({});
    console.log(sliders);
    res.render("slider/slider-view.ejs", {sliders: sliders });
})

router.get('/slider-add',async(req,res)=>{
    let userid = req.cookies.userid;
    if(userid){
        let verify = await userModel.find({_id: userid})
        if(verify.length > 0){
            if(verify[0].userRole !== 0){
                res.redirect("/")
            }
        }else{
            res.redirect("/")
        }
    }else{
        res.redirect("/")
    }
    res.render("slider/slider-add.ejs");
})

router.get("/order-view", async(req,res)=>{
    let userid = req.cookies.userid;
    if(userid){
        let verify = await userModel.find({_id: userid})
        if(verify.length > 0){
            if(verify[0].userRole !== 0){
                res.redirect("/")
            }
        }else{
            res.redirect("/")
        }
    }else{
        res.redirect("/")
    }
    let Orders = await orderModel
        .find({})
        .populate("allProduct.id", "name image price")
        .populate("user", "name")
        .populate("address", "aaddress aphone aname acity apincode")
        .sort({ _id: -1 });
    res.render("orders/order-view.ejs", {orders: Orders });
})



module.exports = router;
