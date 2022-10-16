import axios from "axios";
import Noty from "noty";

import { loadStripe } from "@stripe/stripe-js";
import { placeOrder } from "./apiService";

export default async function initStripe() {
  const stripe = await loadStripe(
    "pk_test_51JYOOdSG2e8tIYNjSfFB9SzZ8n3T6rO5sk7e6gQYI6DTqngdys0cyIztV4qbUpNvNZRNpBTQYmn3ijyGjIUWCKt100fMfEVptC"
  );
  let paymentType = document.querySelector("#paymentType");
  const elements = stripe.elements();
  let card = null;

  if (!paymentType) {
    return;
  }
  paymentType.addEventListener("change", (e) => {
    console.log(e.target.value);
    if (e.target.value === "card") {
      // Display Widget
      //  card = new CardWidget(stripe)
      //  card.mount()
      card = elements.create("card", { hidePostalCode: true });
      card.mount("#card-element");
    } else {
      card.destroy();
    }
  });
  // ajax call
  let paymentForm = document.querySelector("#payment-form");
  if (paymentForm) {
    paymentForm.addEventListener("submit", (e) => {
      e.preventDefault();
      let formObj = {};

      let formData = new FormData(paymentForm);

      for (const [key, value] of formData) {
        formObj[key] = value;
      }

      // verfiy stripe token
      if (!card) {
        placeOrder(formObj)
        // console.log(formObj)
        return;
      }

      stripe
          .createToken(card)
          .then((result) => {
            console.log(result);
            formObj.stripeToken = result.token.id
            placeOrder(formObj)
          })
          .catch((err) => {
            console.log(err);
          });
    });
  }
}
