import express, { Router, Request, Response } from "express";
import Cat from "../schemas/cat.model";

const catRouter: Router = express.Router();

// List all available cats
catRouter.get("/", async (req: Request, res: Response) => {
  try {
    const cats = await Cat.find();
    res.json({ cats });
  } catch (error) {
    res.status(500).json({ error: "Error fetching cats" });
  }
});

// Add a new cat
catRouter.post("/", async (req: Request, res: Response) => {
  try {
    const { name, breed, age } = req.body;
    const cat = new Cat({ name, breed, age });
    await cat.save();
    res.json(cat);
  } catch (error) {
    res.status(500).json({ error: "Error adding cat" });
  }
});

// Remove a cat
catRouter.delete("/:id", async (req: Request, res: Response) => {
  try {
    const catId = req.params.id;
    await Cat.findByIdAndDelete(catId);
    res.json({ message: "Cat removed successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error removing cat" });
  }
});

export default catRouter;
