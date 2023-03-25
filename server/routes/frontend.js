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
        console.log(RecentProducts);
    let Sponsors = await sponsorModel.find({}).sort({ _id: -1 });
    res.render("frontend/index.ejs", {products: Products, categories: Categories,recentproducts:RecentProducts, sponsors:Sponsors});
})

router.get("/single",async (req,res) => {
    res.render("frontend/single-product.ejs");
})

module.exports = router;
