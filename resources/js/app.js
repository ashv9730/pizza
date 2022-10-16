import axios from "axios";
import Noty from "noty";
import initAdmin from "./admin";
import moment from "moment";
import initStripe from "./stripe";
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

// single order page
let statues = document.querySelectorAll(".status_line");
let hiddenInput = document.querySelector("#hiddenInput");
let order = hiddenInput ? hiddenInput.value : null;
order = JSON.parse(order);
// console.log('order',order)
let time = document.createElement("small");

function updateStatus(order) {
  statues.forEach((status) => {
    status.classList.remove("step-completed");
    status.classList.remove("current");
  });
  let stepCompleted = true;
  statues.forEach((status) => {
    if (stepCompleted) {
      status.classList.add("stepCompleted");
    }
    let dataProps = status.dataset.status;
    if (dataProps === order.status) {
      stepCompleted = false;
      time.innerText = moment(order.updatedAt).format("hh:mm A");
      status.appendChild(time);
      if (status.nextElementSibling) {
        status.nextElementSibling.classList.add("current");
      }
    }
  });
}

updateStatus(order);



// payment form
initStripe()




// socket

let socket = io();

if (order) {
  socket.emit("join", `order_${order._id}`);
}
initAdmin(socket);
// admin
let adminAreaPath = window.location.pathname;
if (adminAreaPath.includes("admin")) {
  socket.emit("join", "adminRoom");
}

socket.on("orderUpdated", (data) => {
  console.log(data);
  const updatedOrder = { ...order };
  updatedOrder.updatedAt = moment().format();
  updatedOrder.status = data.status;
  updateStatus(updatedOrder);
  new Noty({
    type: "success",
    timeout: 1000,
    text: data.status,
    progressBar: false,
  }).show();
});

socket.on("connect_error", (err) => {
  console.log(`connect_error due to ${err.message}`);
});
