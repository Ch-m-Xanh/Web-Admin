import { Schema, model, Document } from "mongoose";

export interface IPlant extends Document {
  name: string;
  scientificName?: string;
  description?: string;
  careLevel: "easy" | "medium" | "hard";
  light?: string;
  water?: string;
  category: string;
  images: string[];
  isMedicinal: boolean;
  tags: string[];
  viewCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const plantSchema = new Schema<IPlant>(
  {
    name: { type: String, required: true, trim: true },
    scientificName: { type: String, default: "" },
    description: { type: String, default: "" },
    careLevel: { type: String, enum: ["easy", "medium", "hard"], default: "easy" },
    light: { type: String, default: "" },
    water: { type: String, default: "" },
    // Kept as free-form string for flexibility, common values:
    // 'phong-ngu' | 'ban-lam-viec' | 'phong-bep' | 'rau-cu-chua-benh'
    category: { type: String, required: true, index: true },
    images: [{ type: String }],
    isMedicinal: { type: Boolean, default: false },
    tags: [{ type: String }],
    viewCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

plantSchema.index({ name: "text", description: "text", tags: "text" });

export const Plant = model<IPlant>("Plant", plantSchema);
