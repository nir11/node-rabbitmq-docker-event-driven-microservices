import mongoose, { Document } from "mongoose";

type AdoptionStatus = "pending" | "confirmed" | "rejected";

interface User extends Document {
  firstName: string;
  lastName: string;
  email: string;
  adoptions: {
    catId: string;
    status: AdoptionStatus;
  }[];
}

const userSchema = new mongoose.Schema<User>({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  adoptions: [
    {
      catId: { type: mongoose.Schema.Types.ObjectId, required: true },
      status: {
        type: String,
        enum: ["pending", "confirmed", "rejected"],
        default: "pending",
      },
    },
  ],
});

export default mongoose.model<User>("User", userSchema);
