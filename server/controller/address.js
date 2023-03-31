const addressModel = require("../models/address");

class Address {

  async postAddress(req, res) {
    let { aname, aadress, aphone, user } =
      req.body;
    if (
      !aname |
      !aphone |
      !aadress |
      !user
    ) {
      return res.json({ error: "All fields are required" });
    }
    else {
      try {
        let newAddress = new addressModel({
          aname: aname,
          aphone: aphone,
          aadress: aadress,
          user: user
        });
        let save = await newAddress.save();
        if (save) {
          return res.redirect("/")
          // return res.json({ success: "Product created successfully" });
        }
      } catch (err) {
        console.log(err);
      }
    }
  }

  async getDeleteAddress(req, res) {
    let { _id } = req.body;
    if (!_id) {
      return res.json({ error: "All fields must be required" });
    } else {
      try {
        let deleteProduct = await productModel.findByIdAndDelete(_id);
        if (deleteProduct) {
          return res.redirect("/");
        }
      } catch (err) {
        console.log(err);
      }
    }
  }

}

const addressController = new Address();
module.exports = addressController;
