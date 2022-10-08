export default function cartController() {
  return {
    // actual is like this refrence javascript object
    // index : (req,res) => {
    //     res.render("home");
    // }
    index(req, res) {
      res.render("customers/cart");
    },
    update(req, res) {
      // let cart = {
      //     items: {
      //         pizzaId: { item: pizzaObject, qty:0 },
      //         pizzaId: { item: pizzaObject, qty:0 },
      //         pizzaId: { item: pizzaObject, qty:0 },
      //     },
      //     totalQty: 0,
      //     totalPrice: 0
      // }
      // for the first time creating cart and adding basic object structure

      if (!req.session.cart) {
        req.session.cart = {
          items: {},
          totalQty: 0,
          totalPrice: 0,
        };
      }

      //   console.log(req.body)

      let cart = req.session.cart;

      if (!cart.items[req.body._id]) {
        cart.items[req.body._id] = {
          items: req.body,
          qty: 1,
        };
        cart.totalQty = cart.totalQty + 1;
        cart.totalPrice = cart.totalPrice + req.body.price;
      } else {
        cart.items[req.body._id].qty = cart.items[req.body._id].qty + 1;
        cart.totalQty = cart.totalQty + 1;
        cart.totalPrice = cart.totalPrice + req.body.price;
      }

      res.send( req.session.cart);
    },
  };
}
