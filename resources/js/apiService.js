import axios from "axios";
import Noty from "noty";

export function placeOrder(formObj) {
    axios
        .post("/orders", formObj)
        .then((res) => {
          console.log(res.data);
          new Noty({
            type: "success",
            timeout: 1000,
            text: res.data.success,
            progressBar: false,
          }).show();

          setTimeout(() => {
            window.location.href = "/customer/orders";
          }, 1000);
        })
        .catch((err) => {
          console.log(err);
        });
}