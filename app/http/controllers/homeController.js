import Menu from "../../models/menu";

export default function homeController() {
  return {
    // actual is like this refrence javascript object
    // index : (req,res) => {
    //     res.render("home");
    // }
    async index(req, res) {
      const pizzas = await Menu.find();
      // console.log(pizzas);
      res.render("home", {pizzas: pizzas});
    },
  };
}
