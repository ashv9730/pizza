import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    items: {
      type: Object,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    paymentType: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      default: "order_placed",
    },
    paymentStatus: {
      type: String,
      default: "paid",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Orders", orderSchema);
