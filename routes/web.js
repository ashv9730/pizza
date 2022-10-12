import adminOrderController from "../app/http/controllers/admin/adminOrderController";
import statusController from "../app/http/controllers/admin/statusController";
import authController from "../app/http/controllers/authController";
import cartController from "../app/http/controllers/customers/cartController";
import homeController from "../app/http/controllers/homeController";
import orderController from "../app/http/controllers/orderController";
import admin from "../app/http/middlewares/admin";
import auth from "../app/http/middlewares/auth";
import guest from "../app/http/middlewares/guest";

export default function initRoutes(app) {
  app.get("/", homeController().index);
  app.get("/cart", cartController().index);
  app.post("/update-cart", cartController().update);
  app.get("/login", guest, authController().login);
  app.post("/login", authController().postLogin);
  app.post("/logout", authController().logout);
  app.get("/register", guest, authController().register);
  app.post("/register", authController().postRegister);
  app.post("/orders", auth, orderController().store);
  // customer
  app.get("/customer/orders", auth, orderController().index);
  app.get("/customer/orders/:_id", auth, orderController().show);
  
  // admin
  app.get("/admin/orders", admin, adminOrderController().index);
  app.post("/admin/order/status", admin, statusController().index);
  
}
