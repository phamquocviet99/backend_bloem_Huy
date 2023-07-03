import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    nameVendor: {
      type: String,
      required: true,
    },
    type: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      default: "pending",
    },
    image: [],
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
export default mongoose.model("services", schema);
