import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import feedBackRouter from "./routes/feedBack.routes.js";
import demandRouter from "./routes/demand.routes.js";
import myCartRouter from "./routes/myCart.routes.js"
const app = express();
dotenv.config();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" })); // limit from front-end data 30MB
app.use(cors());
// app.use(
//   cors({
//     origin: "*",
//   })
// );
app.use("/feedback", feedBackRouter);
app.use("/demands", demandRouter);
app.use("/myCart", myCartRouter);
mongoose
  .connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .catch((err) => {
    console.log("err", err);
  })
  .then(() => {
    console.log("Connected to Mongoose");
  });
app.listen(PORT, () => {
  console.log(`Our app is running on port ${PORT}`);
});
