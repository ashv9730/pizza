import axios from "axios";
import Noty from "noty";
import initAdmin from "./admin";

let addToCart = document.querySelectorAll(".add-to-cart");
let cartCounter = document.querySelector("#cartCounter");
function updateCart(pizza) {
  axios
    .post("/update-cart", pizza)
    .then((res) => {
      // console.log(res);
      cartCounter.innerText = res.data.totalQty;
      new Noty({
        text: "Items Added to Cart",
        type: "success",
        timeout: 3,
        progressBar: false,
      }).show();
    })
    .catch((error) => {
      console.log("error message from update-cart resources/app.js", error);
      new Noty({
        text: "Something went Wrong",
        type: "warning",
        timeout: 3,
        progressBar: false,
      }).show();
    });
}

addToCart.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    let pizza = JSON.parse(btn.dataset.pizza);
    updateCart(pizza);
    // console.log(pizza)
  });
});

const alertMsg = document.querySelector("#success-alert");
if (alertMsg) {
  setTimeout(() => {
    alertMsg.remove();
  }, 5000);
}

initAdmin();
