const mongoose = require("mongoose");

const PaymentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
      index: true,
    },
    amount: {
      type: Number,
      required: [true, "Payment amount is required"],
    },
    currency: {
      type: String,
      default: "usd",
    },
    stripePaymentId: {
      type: String,
      required: [true, "Stripe payment identifier is required"],
      unique: true,
    },
    status: {
      type: String,
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Payment", PaymentSchema);
