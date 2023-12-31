import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    nameVendor: {
      type: String,
      required: true,
    },
    logo: {
      type: String,
      default:
        "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png",
    },
    category: {
      type: String,
      require: true,
    },
    subCategory: {
      type: String,
      require: true,
    },
    quantity: {
      type: Number,
      required: true,
      default: 1,
    },
    price: {
      type: Number,
      required: true,
    },
    idVendor: {
      type: String,
      required: true,
    },
    address: {
      type: String,
    },
    name: {
      type: String,
      required: true,
    },
    sale: {
      type: Number,
      required: false,
      default: 0,
    },
    description: {
      type: String,
      required: true,
    },
    rating: [],
    images: [],
    cId: {
      type: String,
      default: null,
    },
    listComments: [
      {
        name: String,
        comment: String,
        rating: Number,
        images: [],
        createAt: {
          type: Date,
          default: Date.now,
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
export default mongoose.model("demands", schema);
