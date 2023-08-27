import mongoose, { Document } from "mongoose";

interface Cat extends Document {
  name: string;
  breed: string;
  age: number;
  isAdopted: boolean;
  adoptedBy?: string;
  adoptionDate?: Date;
}

const catSchema = new mongoose.Schema<Cat>({
  name: { type: String, required: true },
  breed: { type: String, required: true },
  age: { type: Number, required: true },
  isAdopted: { type: Boolean, default: false },
  adoptedBy: { type: String },
  adoptionDate: { type: Date },
});

export default mongoose.model<Cat>("Cat", catSchema);
