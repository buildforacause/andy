const express = require("express");
const router = express.Router();
const categoryModel = require("../models/categories");
const productModel = require("../models/products");
const sponsorModel = require("../models/sponsor");
const addressModel = require("../models/address");
const customizeModel = require("../models/customize");

router.get('/',async (req,res) => {
    let Products = await productModel
        .find({featured: true})
        .populate("category", "_id cName")
        .sort({ _id: -1 })
        .limit(5);
    let Categories = await categoryModel.find({}).sort({ _id: -1 });
    let RecentProducts= await productModel
        .find({})
        .populate("category")
        .sort({"createdAt":-1})
        .limit(10);
    let Sponsors = await sponsorModel.find({}).sort({ _id: -1 });
    let sliders = await customizeModel.find({});
    let user = req.cookies.autOken
    res.render("frontend/index.ejs", {products: Products, categories: Categories,recentproducts:RecentProducts, sponsors:Sponsors, user:user, sliders:sliders});
})

router.get("/cart",async (req,res)=>{
    let user=req.cookies.autOken
    res.render("frontend/cart.ejs",{user:user})
})

router.get("/dashboard",async (req,res)=>{
    let user=req.cookies.autOken
    let userid = req.cookies.userid
    let userAddress = await addressModel.find({user: userid})
    res.render("frontend/dashboard.ejs",{user:user, addresses: userAddress, userid:userid})
})

router.get("/track",async (req,res)=>{
    let user=req.cookies.autOken
    res.render("frontend/track.ejs",{user:user})
})

router.get("/checkout",async (req,res)=>{
    // res.redirect("/cart");
    let user=req.cookies.autOken
    res.render("frontend/checkout.ejs",{user:user});
})

router.post("/checkout",async (req,res)=>{
    let user=req.cookies.autOken
    let ids = req.body.productids
    let quantity = req.body.quantity
    let userid = req.cookies.userid
    let cartProducts = await productModel.find({
        _id: { $in: ids },
    });
    let userAddress = await addressModel.find({user: userid})
    if(cartProducts.length === 1){
        for(let i=0; i<cartProducts.length; i++){
            if(cartProducts[i].quantity < quantity[i]){
                res.redirect("/cart")
            }else{
            cartProducts[i].quantity = quantity[i]
            }
        }
    }else{
        if(cartProducts.length !== ids.length){
            res.redirect("/cart")
        }else{
            for(let i=0; i<cartProducts.length; i++){
                if(cartProducts[i].quantity < quantity[i]){
                    res.redirect("/cart") 
                }else{
                cartProducts[i].quantity = quantity[i]
                }
            }
        }
    }
    res.render("frontend/checkout.ejs",{user:user, products: cartProducts, addresses: userAddress})
})

router.get("/view/:id",async (req,res) => {
    let id = req.params.id;
    let Product = await productModel
    .find({_id: id})
    .populate("category", "_id cName")
    let allProds = await productModel.find({'_id': {$ne : id}}).populate("category", "_id cName")
    let user = req.cookies.autOken
    res.render("frontend/single-product.ejs", {product: Product[0], allProds: allProds, user:user});
})

router.get("/shop",async (req,res) => {
    let title = ""
    let allProds = []
    if(req.query.filterby){
        try{
            allProds = await productModel.find({category: req.query.filterby}).populate("category", "_id cName");
            title = await categoryModel.find({_id: req.query.filterby});
            if(title){
                title = title[0].cName;
            }else{
                return res.redirect("/")
            }
        }catch(e){
            return res.redirect("/")
        }
    }else if(req.query.s){
        allProds = await productModel.find({
            $or: 
            [
                {
                    name: 
                        { 
                            $regex: req.query.s, $options: "i" 
                        }
                },
                {
                    description: 
                        { 
                            $regex: req.query.s, $options: "i" 
                        }
                },
            ]
        }).populate("category", "_id cName");
        title = "Search Results For " + req.query.s;
    }
    else{
        allProds = await productModel.find({}).populate("category", "_id cName");
        title = "All Products"
    }
    let Categories = await categoryModel.find({}).sort({ _id: -1 });
    let user = req.cookies.autOken
    res.render("frontend/results.ejs", {allProds: allProds, cats: Categories, user:user, title: title});
})

router.get("/check-quantity/:id",async (req,res) => {
    let id = req.params.id
    let prod = await productModel.find({_id: id});
    let quantity = prod[0].quantity;
    res.json({quantity: quantity});
})

module.exports = router;
