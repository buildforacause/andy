const orderModel = require("../models/orders");
const productModel = require("../models/products");

class Order {
  async getAllOrders(req, res) {
    try {
      let Orders = await orderModel
        .find({})
        .populate("allProduct.id", "name image price")
        .populate("user", "name email")
        .sort({ _id: -1 });
      if (Orders) {
        return res.json({ Orders });
      }
    } catch (err) {
      console.log(err);
    }
  }

  async getOrderByUser(req, res) {
    let { uId } = req.body;
    if (!uId) {
      return res.json({ message: "All filled must be required" });
    } else {
      try {
        let Order = await orderModel
          .find({ user: uId })
          .populate("allProduct.id", "name image price")
          .populate("user", "name email")
          .sort({ _id: -1 });
        if (Order) {
          return res.json({ Order });
        }
      } catch (err) {
        console.log(err);
      }
    }
  }

  async postCreateOrder(req, res) {
    let { allProduct, user, amount, transactionId, address, notes } = req.body;
    if (
      !allProduct ||
      !user ||
      !amount ||
      !transactionId ||
      !address 
    ) {
      return res.json({ msg: "All fields must be required" });
    } else {
      try {
        allProduct = JSON.parse(allProduct);
        console.log(allProduct)
        let newOrder = new orderModel({
          allProduct: allProduct,
          user: user,
          amount: amount,
          transactionId: transactionId,
          address:address,
          notes: notes
          
        });
        
        let save = await newOrder.save();
        if (save) {
          allProduct.forEach(async (prod) => {
            let p = await productModel.find({_id: prod.id});
            let quant = p[0].quantity;
            let remain = quant - prod.quantity;
            let q = await productModel.findByIdAndUpdate(prod.id, {
              quantity: remain,
              updatedAt: Date.now(),
            });
          });
          return res.json({success: "DONE"})
        }
      } catch (err) {
        console.log(err)
        return res.json({ msg: err });
      }
    }
  }

  async postUpdateOrder(req, res) {
    let { oId, status } = req.body;
    if (!oId || !status) {
      return res.json({ message: "All filled must be required" });
    } else {
      let currentOrder = orderModel.findByIdAndUpdate(oId, {
        status: status,
        updatedAt: Date.now(),
      });
      currentOrder.exec((err, result) => {
        if (err) console.log(err);
        return res.json({ success: "Order updated successfully" });
      });
    }
  }

  async postDeleteOrder(req, res) {
    let { oId } = req.body;
    if (!oId) {
      return res.json({ error: "All filled must be required" });
    } else {
      try {
        let deleteOrder = await orderModel.findByIdAndDelete(oId);
        if (deleteOrder) {
          return res.json({ success: "Order deleted successfully" });
        }
      } catch (error) {
        console.log(error);
      }
    }
  }
}

const ordersController = new Order();
module.exports = ordersController;
