const express = require("express");
const router = express.Router();
const { toTitleCase } = require("../config/function");
const categoryModel = require("../models/categories");
const productModel = require("../models/products");
const pincodeModel = require("../models/pincode");
// const ordersController = require("../controller/orders");

router.get('/',async (req,res) => {
    res.render("admin.ejs");
})

router.get('/product-view',async(req,res)=>{
    let Products = await productModel
        .find({})
        .populate("category", "_id cName")
        .sort({ _id: -1 });
    res.render("product/product_view.ejs", {products: Products});
})

router.get('/product-add',async(req,res)=>{
    let Categories = await categoryModel.find({}).sort({ _id: -1 });
    res.render("product/products_add.ejs", {categories: Categories});
})

router.get('/product-edit/:id',async(req,res)=>{
    let id = req.params.id
    let singleProduct = await productModel
          .findById(id)
          .populate("category", "_id cName")
          .populate("pRatingsReviews.user", "name email userImage");
    res.render("product/products_edit.ejs", {prod: singleProduct });
})

router.get('/category-view',async(req,res)=>{
    let Categories = await categoryModel.find({}).sort({ _id: -1 });
    res.render("category/category_view.ejs", {categories: Categories});
})

router.get('/category-add',async(req,res)=>{
    res.render("category/category_add.ejs");
})

router.get('/category-edit/:id',async(req,res)=>{
    let id = req.params.id
    let singleCat = await categoryModel.findById(id);
    res.render("category/category_edit.ejs", {cat: singleCat });
})

router.get("/pincode-view", async(req,res)=>{
    let Pincodes = await pincodeModel.find({}).sort({ _id: -1 });
    res.render("pincode/pincode-view.ejs", {pincodes: Pincodes });
})

router.get('/pincode-add',async(req,res)=>{
    res.render("pincode/pincode-add.ejs");
})

router.get('/pincode-edit/:id',async(req,res)=>{
    let id = req.params.id
    let pincode = await pincodeModel.findById(id);
    res.render("pincode/pincode-edit.ejs", {pincode: pincode });
})

module.exports = router;
