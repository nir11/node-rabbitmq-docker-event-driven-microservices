import express, { Router, Request, Response } from "express";
import User from "../schemas/user.model";
import { sendMessageToRabbitMQ } from "../modules/rabiitMq";

const userRouter: Router = express.Router();

// Register a new user
userRouter.post("/register", async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, email } = req.body;
    const user = new User({ firstName, lastName, email });
    await user.save();
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Error registering user" });
  }
});

// Express interest in adopting a cat
userRouter.put("/adopt", async (req: Request, res: Response) => {
  try {
    const { userId, catId } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if the user has already expressed interest in adopting this cat
    const existingAdoption = user.adoptions.find(
      (adoption) => adoption.catId.toString() === catId
    );
    if (existingAdoption) {
      return res
        .status(400)
        .json({ error: "Already expressed interest in adopting this cat" });
    }

    // Add adoption request to user's adoptions array
    user.adoptions.push({ catId, status: "pending" });
    await user.save();

    // Publish adoption request message to RabbitMQ
    const message = JSON.stringify({ userId, catId });
    sendMessageToRabbitMQ("cat-adoption-requests", Buffer.from(message));

    res.json({ message: "Adoption request sent" });
  } catch (error) {
    res.status(500).json({ error: "Error sending adoption request" });
  }
});

// Get all users
userRouter.get("/", async (req: Request, res: Response) => {
  try {
    const users = await User.find();
    res.json({ users });
  } catch (error) {
    res.status(500).json({ error: "Error fetching user" });
  }
});

// Get user by id
userRouter.get("/:id", async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Error fetching user" });
  }
});

export default userRouter;
