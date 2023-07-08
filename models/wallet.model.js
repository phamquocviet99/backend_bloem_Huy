import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    _id: {
      type: String,
      require: true,
    },
    sumWithDraw: {
      type: Number,

      default: 0,
    },
    sumDeposit: {
      type: Number,

      default: 0,
    },
    sum: {
      type: Number,
      default: 0,
    },
    history: [
      {
        type: { type: String },
        createAt: {
          type: Date,
          default: Date.now,
        },
        content: {
          type: String,
        },
        amount: {
          type: Number,
          default: 0,
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
export default mongoose.model("wallets", schema);
