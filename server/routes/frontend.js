const express = require("express");
const router = express.Router();
const categoryModel = require("../models/categories");
const productModel = require("../models/products");
const sponsorModel = require("../models/sponsor");

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
    let user = req.cookies.autOken
    res.render("frontend/index.ejs", {products: Products, categories: Categories,recentproducts:RecentProducts, sponsors:Sponsors, user:user});
})

router.get("/cart",async (req,res)=>{
    let user=req.cookies.aut0ken
    res.render("frontend/cart.ejs",{user:user})
})

router.get("/checkout",async (req,res)=>{
    res.redirect("/cart");
})

router.post("/checkout",async (req,res)=>{
    let user=req.cookies.aut0ken
    let ids = req.body.productids
    let quantity = req.body.quantity
    let cartProducts = await productModel.find({
        _id: { $in: ids },
    });
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
    console.log(cartProducts)
    res.render("frontend/checkout.ejs",{user:user, products: cartProducts})
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
    let allProds = await productModel.find({}).populate("category", "_id cName");
    let Categories = await categoryModel.find({}).sort({ _id: -1 });
    let user = req.cookies.autOken
    res.render("frontend/results.ejs", {allProds: allProds, cats: Categories, user:user});
})

router.get("/check-quantity/:id",async (req,res) => {
    let id = req.params.id
    let prod = await productModel.find({_id: id});
    let quantity = prod[0].quantity;
    res.json({quantity: quantity});
})

module.exports = router;
