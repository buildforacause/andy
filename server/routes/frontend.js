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
    res.render("frontend/index.ejs", {products: Products, categories: Categories,recentproducts:RecentProducts, sponsors:Sponsors});
})

router.get("/view/:id",async (req,res) => {
    let id = req.params.id;
    let Product = await productModel
    .find({_id: id})
    .populate("category", "_id cName")
    let allProds = await productModel.find({'_id': {$ne : id}}).populate("category", "_id cName")
    res.render("frontend/single-product.ejs", {product: Product[0], allProds: allProds});
})

module.exports = router;
