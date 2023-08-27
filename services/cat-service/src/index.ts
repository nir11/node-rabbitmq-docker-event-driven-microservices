import express from "express";
import dotenv from "dotenv";
dotenv.config();
import catRouter from "./routes/cat.routes";
import mongoose from "mongoose";
import { connectToRabbitMQ } from "./modules/rabiitMq";

mongoose
  .connect(`${process.env.MONGODB_URI}/cats`)
  .then(() => console.log("Connected to the Database!"))
  .catch((err) => console.log(err));

const app = express();
const PORT = process.env.PORT || 3002;

app.use(express.json());
app.use("/cats", catRouter);

app.listen(PORT, () => {
  console.log(`Cat Service is listening on port ${PORT}`);
});

connectToRabbitMQ()
  .then(() => {
    console.log("Connected to RabbitMQ!");
  })
  .catch((err) => console.error("Error connecting to RabbitMQ:", err));
