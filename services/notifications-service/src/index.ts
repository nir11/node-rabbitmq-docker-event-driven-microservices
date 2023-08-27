import express, { Request, Response } from "express";
import dotenv from "dotenv";
import { connectToRabbitMQ } from "./modules/rabiitMq";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3003;

app.use(express.json());

app.listen(PORT, () => {
  console.log(`Adoption Service is listening on port ${PORT}`);
});

connectToRabbitMQ()
  .then(() => {
    console.log("Connected to RabbitMQ!");
  })
  .catch((err) => console.error("Error connecting to RabbitMQ:", err));
