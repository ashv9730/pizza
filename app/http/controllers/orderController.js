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
            Order.populate(result, { path: "customerId" })
              .then((placedOrder) => {
                req.flash("success", "Order Placed SuccessFully");
                delete req.session.cart;
                const eventEmitter = req.app.get("eventEmitter");
                eventEmitter.emit("orderPlaced", result);
                return res.redirect("/customer/orders");
              })
              .catch((err) => {
                req.flash("error", "something went wrong");
                console.log("error", err.message);
              });
          })
          .catch((err) => {
            req.flash("error", "something went wrong");
            return res.redirect("/cart");
          });
      } catch (error) {
        res.send({ error: error.message });
      }
    },
    async index(req, res) {
      const orders = await Order.find({ customerId: req.user._id }).sort({
        createdAt: -1,
      });
      // console.log(orders)
      // res.header('Cache-Control', 'no-store')
      res.render("customers/order", { orders: orders, moment: moment });
    },
    show(req, res) {
      const { _id } = req.params;
      // console.log(_id)
      Order.findOne({ _id })
        .then((order) => {
          // console.log(order)
          if (req.user._id.toString() == order.customerId.toString()) {
            return res.render("customers/singleOrder", { order: order });
          }
          return res.redirect("/");
        })
        .catch((err) => {
          console.log(err);
        });
    },
  };
}
