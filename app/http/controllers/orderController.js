import { session } from "passport";
import Order from "../../models/order";
import moment from "moment";
import Stripe from "stripe";
const stripe = new Stripe(
  "sk_test_51JYOOdSG2e8tIYNjlL6qYPgtjRaS7TuzRUw03gtttlYXQGd7rlHUxRMiOGqiHG1c1epzobtN1AcJvJora6zJ4XVy00ltXFH5tm"
);
export default function orderController() {
  return {
    store(req, res) {
      // console.log(req.body)
      try {
        const { paymentType, phone, address, stripeToken } = req.body;
        // console.log({ paymentType, phone, address, stripeToken });
        if (!phone || !address) {
          return res.status(422).json({ error: "All fields are required" });
          // req.flash("error", "All fields are required");
          // req.flash("phone", phone);
          // req.flash("address", address);
          // return res.redirect("/cart");
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
                // req.flash("success", "Order Placed SuccessFully");
                // stripe token verification
                if (paymentType == "card") {
                  stripe.charges
                    .create({
                      amount: req.session.cart.totalPrice * 100,
                      source: stripeToken,
                      currency: "inr",
                      description: `Pizza id ${placedOrder._id}`,
                    })
                    .then(() => {
                      placedOrder.paymentStatus = true;
                      placedOrder
                        .save()
                        .then((ord) => {
                          console.log(ord);
                          const eventEmitter = req.app.get("eventEmitter");
                          eventEmitter.emit("orderPlaced", ord);
                          delete req.session.cart;

                          return res.json({
                            success:
                              "Order Placed SuccessFully payment sucessful",
                          });
                        })
                        .catch((err) => {
                          console.log(err);
                        });
                    })
                    .catch((err) => {
                      console.log(err);
                      const eventEmitter = req.app.get("eventEmitter");
                      eventEmitter.emit("orderPlaced", ord);
                      delete req.session.cart;
                      return res.json({
                        success:
                          "Payment failed but Order Placed you can pay at delievr time",
                      });
                    });
                }
                const eventEmitter = req.app.get("eventEmitter");
                eventEmitter.emit("orderPlaced", ord);
                delete req.session.cart;
                return res.json({
                  success: "Order Placed Succesful",
                });
                // return res.redirect("/customer/orders");
              })
              .catch((err) => {
                req.flash("error", "something went wrong");
                console.log("error", err.message);
              });
          })
          .catch((err) => {
            // req.flash("error", "something went wrong");
            return res.status(500).json({
              success: "something went wrong",
            });
            // return res.redirect("/cart");
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
