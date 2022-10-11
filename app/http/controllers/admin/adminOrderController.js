import Order from "../../../models/order";

export default function adminOrderController() {
  return {
    index(req, res) {
      Order.find({ status: { $ne: "completed" } })
        .sort({ createdAt: -1 })
        .populate("customerId", "-password")
        .then((order) => {
          if (req.xhr) {
          return res.json(order)
          }
          return res.render("admin/orders");
        })
        .catch((err) => {
          console.log(err.message);
        });
    },
  };
}
