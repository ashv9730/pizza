import authController from "../app/http/controllers/authController";
import cartController from "../app/http/controllers/customers/cartController";
import homeController from "../app/http/controllers/homeController";

export default function initRoutes(app) {
  app.get("/", homeController().index);
  app.get("/cart", cartController().index);
  app.post("/update-cart", cartController().update);
  app.get("/login", authController().login);
  app.get("/register", authController().register);
}
