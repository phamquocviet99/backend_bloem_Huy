import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    idVendor: {
      type: String,
      required: true,
    },
    idDemand: {
      type: String,
      require: true,
    },
    quantity: {
      type: Number,
      require: true,
      default: 1,
    },
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
export default mongoose.model("myCarts", schema);
