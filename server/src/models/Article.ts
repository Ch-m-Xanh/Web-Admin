import { Schema, model, Document } from "mongoose";

export interface IArticle extends Document {
  title: string;
  content: string;
  coverImage?: string;
  tags: string[];
  createdAt: Date;
}

const articleSchema = new Schema<IArticle>(
  {
    title: { type: String, required: true, trim: true },
    content: { type: String, required: true },
    coverImage: { type: String, default: "" },
    tags: [{ type: String }],
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const Article = model<IArticle>("Article", articleSchema);
