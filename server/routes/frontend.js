const express = require("express");
const router = express.Router();
const categoryModel = require("../models/categories");
const productModel = require("../models/products");
const sponsorModel = require("../models/sponsor");
const addressModel = require("../models/address");
const customizeModel = require("../models/customize");
const infoModel = require("../models/info");
const userModel = require("../models/users");
const orderModel = require("../models/orders");

router.get('/',async (req,res) => {
    let Products = await productModel
        .find({featured: true})
        .populate("category", "_id cName")
        .sort({ _id: -1 })
        .limit(5);
    Products = Products.filter((value, index, self) =>
        index === self.findIndex((t) => (
            t.SKU === value.SKU
        ))
    )
    let Categories = await categoryModel.find({cStatus: "Active"}).sort({ _id: -1 });
    let navCats = await categoryModel.find({cStatus: "Active"}).sort({ _id: -1 }).limit(5);
    let RecentProducts= await productModel
        .find({})
        .populate("category")
        .sort({"createdAt":-1})
        .limit(10);

    RecentProducts = RecentProducts.filter((value, index, self) =>
        index === self.findIndex((t) => (
            t.SKU === value.SKU
        ))
    )
    let Sponsors = await sponsorModel.find({}).sort({ _id: -1 });
    let sliders = await customizeModel.find({});
    let user = req.cookies.autOken
    let userid = req.cookies.userid
    let Info = await infoModel.find({});
    res.render("frontend/index.ejs", {info: Info[0],navCats: navCats,userid: userid,products: Products, categories: Categories,recentproducts:RecentProducts, sponsors:Sponsors, user:user, sliders:sliders});
})

router.get("/cart",async (req,res)=>{
    let user=req.cookies.autOken
    let userid = req.cookies.userid
    let navCats = await categoryModel.find({cStatus: "Active"}).sort({ _id: -1 }).limit(5);
    let Info = await infoModel.find({});
    let errmsg = ""
    let errid = ""
    res.render("frontend/cart.ejs",{errmsg: errmsg, errid: errid,user:user, userid: userid, navCats: navCats, info:Info[0]})
})

router.get("/dashboard",async (req,res)=>{
    let user=req.cookies.autOken
    let userid = req.cookies.userid
    if(!user){
        res.redirect("/");
    }
    let userAddress = await addressModel.find({user: userid})
    let navCats = await categoryModel.find({cStatus: "Active"}).sort({ _id: -1 }).limit(5);
    let Info = await infoModel.find({});
    let verify = await userModel.find({_id: userid})
    let orders = await orderModel.find({user: userid}).populate("allProduct.id", "name image price")
    .populate("address", "aaddress aphone aname acity apincode")
    .sort({ _id: -1 });
    res.render("frontend/dashboard.ejs",{orders: orders,verify: verify[0],user:user, addresses: userAddress, userid:userid, navCats: navCats, info: Info[0]})
})

router.get("/track",async (req,res)=>{
    let user=req.cookies.autOken
    let userid = req.cookies.userid
    let navCats = await categoryModel.find({cStatus: "Active"}).sort({ _id: -1 }).limit(5);
    let Info = await infoModel.find({});
    let order = []
    if(req.query.of){
        try{
            order = await orderModel.find({_id: req.query.of}).populate("allProduct.id", "name image price")
            .populate("address", "aaddress aphone aname acity apincode")
        }catch(r){
            res.redirect("/dashboard");
        }
    }else{
        res.redirect("/dashboard");
    }
    console.log(order[0]._id);
    res.render("frontend/track.ejs",{order:order[0],user:user, userid: userid, navCats:navCats, info: Info[0]})
})

router.get("/return",async (req,res)=>{
    if (!req.query.of){
        res.redirect("/dashboard");
    }
    const Orderid=req.query.of;
    let userid = req.cookies.userid;
    console.log(Orderid);
    let orders = await orderModel.find({_id: Orderid}).populate("allProduct.id", "name image price")
    if(!orders[0]._id || orders[0].user!=userid){
        res.redirect("/dashboard");
    }
    // console.log(!orders[0]._id || orders[0].user!=userid);
    res.render("frontend/return.ejs",{})
})

router.get("/checkout",async (req,res)=>{
    res.redirect("/cart");
})

router.post("/checkout",async (req,res)=>{
    let user=req.cookies.autOken
    let ids = req.body.productids
    let quantity = req.body.quantity
    let userid = req.cookies.userid
    let navCats = await categoryModel.find({cStatus: "Active"}).sort({ _id: -1 }).limit(5);
    let Info = await infoModel.find({});
    let cartProducts = await productModel.find({
        _id: { $in: ids },
    });
    let userAddress = await addressModel.find({user: userid})
    if(cartProducts.length === 1){
        for(let i=0; i<cartProducts.length; i++){
            if(cartProducts[i].quantity < quantity[i]){
                let errmsg = "Only " +cartProducts[i].quantity + " remaining.";
                let errid = cartProducts[i]._id                
                res.render("frontend/cart.ejs",{errmsg: errmsg, errid: errid, user:user, userid: userid, navCats: navCats, info:Info[0]})
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
                    let err = {
                        "msg":"Only " + cartProducts[i].quantity + " remaining.",
                        "id": cartProducts[i]._id
                    }
                    
                    res.render("frontend/cart.ejs",{errmsg: err.msg,errid: err.id, user:user, userid: userid, navCats: navCats, info:Info[0]})
                }else{
                cartProducts[i].quantity = quantity[i]
                }
            }
        }
    }

    res.render("frontend/checkout.ejs",{user:user, userid: userid, quantity: quantity, products: cartProducts, addresses: userAddress, navCats: navCats, info:Info[0]})
})

router.get("/view/:id",async (req,res) => {
    let id = req.params.id;
    let Product = await productModel
    .find({_id: id})
    .populate("category", "_id cName")
    .populate("ratings.user")
    let SKU=Product[0].SKU;
    let total = 0;
    Product[0].ratings.map((rating) => {
        total = total + Number(rating.rating)
    })
    total = total / Product[0].ratings.length;
    let ProductSize=await productModel
    .find({SKU: SKU})
    .populate("category", "_id cName");
    let allProds = await productModel.find({'_id': {$ne : id}}).populate("category", "_id cName")
    let user = req.cookies.autOken
    let userid = req.cookies.userid
    let navCats = await categoryModel.find({cStatus: "Active"}).sort({ _id: -1 }).limit(5);
    let Info = await infoModel.find({});
    res.render("frontend/single-product.ejs", {total: total,info: Info[0],userid: userid,product: Product[0],productsizes:ProductSize, allProds: allProds, user:user, userid:userid, navCats: navCats});
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
    let Categories = await categoryModel.find({status: "Active"}).sort({ _id: -1 });
    let user = req.cookies.autOken
    let userid = req.cookies.userid
    allProds = allProds.filter((value, index, self) =>
        index === self.findIndex((t) => (
            t.SKU === value.SKU
        ))
    )
    let navCats = await categoryModel.find({cStatus: "Active"}).sort({ _id: -1 }).limit(5);
    let Info = await infoModel.find({});
    res.render("frontend/results.ejs", {info: Info[0], userid: userid,allProds: allProds, cats: Categories, user:user, title: title, navCats: navCats});
})

router.get("/check-quantity/:id",async (req,res) => {
    let id = req.params.id
    let prod = await productModel.find({_id: id});
    let quantity = prod[0].quantity;
    res.json({quantity: quantity});
})

module.exports = router;
