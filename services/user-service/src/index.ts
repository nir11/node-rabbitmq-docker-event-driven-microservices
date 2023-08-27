import express, { Request, Response } from "express";
import { connectToRabbitMQ } from "./modules/rabiitMq";
import dotenv from "dotenv";
dotenv.config();
import userRouter from "./routes/user.routes";
import mongoose from "mongoose";

mongoose
  .connect(`${process.env.MONGODB_URI}/users`)
  .then(() => console.log("Connected to the Database!"))
  .catch((err) => console.log(err));

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3001;

app.use("/users", userRouter);

app.listen(PORT, () => {
  console.log(`User Service is listening on port ${PORT}`);
});

connectToRabbitMQ()
  .then(() => {
    console.log("Connected to RabbitMQ!");
  })
  .catch((err) => console.error("Error connecting to RabbitMQ:", err));
