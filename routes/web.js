import authController from "../app/http/controllers/authController";
import cartController from "../app/http/controllers/customers/cartController";
import homeController from "../app/http/controllers/homeController";
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
}
