import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    number: {
      type: Number,
      required: true,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    shippingCost: { type: Number, required: true },
    idVendor: {
      type: String,
      required: true,
    },
    idCustomer: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    couponPercent: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      require: true,
      default: "pending",
    },
    demands: [
      {
        idDemand: {
          type: String,
          require: true,
        },
        quantity: {
          type: Number,
          require: true,
        },
      },
    ],
  },
  { timestamps: true }
);
schema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});
export default mongoose.model("orders", schema);
