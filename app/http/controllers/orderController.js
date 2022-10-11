import { session } from "passport";
import Order from "../../models/order";
import moment from "moment";

export default function orderController() {
  return {
    store(req, res) {
      // console.log(req.body)
      try {
        const { paymentType, phone, address } = req.body;
      if (!phone || !address) {
        req.flash("error", "All fields are required");
        req.flash("phone", phone);
        req.flash("address", address);
        return res.redirect("/cart");
      }
      const order = new Order({
        customerId: req.user._id,
        items: req.session.cart.items,
        paymentType,
        phone,
        address,
      });

      order
        .save()
        .then((result) => {
          req.flash('success', 'Order Placed SuccessFully')
          delete req.session.cart
          return res.redirect("/customer/orders");
        })
        .catch((err) => {
          req.flash("error", "something went wrong");
          return res.redirect("/cart");
        });
      } catch (error) {
        res.send({error: error.message})
      }
    },
    async index(req, res) {

      const orders = await Order.find({customerId: req.user._id}).sort({ 'createdAt': -1 } )
        // console.log(orders)
        // res.header('Cache-Control', 'no-store')
        res.render("customers/order", {orders: orders, moment: moment});
      },
  };
}
