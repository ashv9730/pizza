import Order from "../../../models/order";

export default function statusController() {
  return {
    index(req, res) {
      const { orderId, status } = req.body;

      Order.findByIdAndUpdate(
        { _id: orderId },
        {
          status: status,
        }
      )
        .then((order) => {
          // console.log(order);
          const eventEmitter = req.app.get("eventEmitter");
          eventEmitter.emit("orderUpdated", { id: orderId, status: status });
          return res.redirect("/admin/orders");
        })
        .catch((err) => {
          console.log(
            "error message from status controller index:",
            err.message
          );
          return res.redirect("/admin/orders");
        });

      // return res.redirect("/admin/orders");
    },
  };
}
