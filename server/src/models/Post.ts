import { Schema, model, Types, Document } from "mongoose";

export interface IPost extends Document {
  userId: Types.ObjectId;
  userPlantId?: Types.ObjectId;
  imageUrl: string;
  caption?: string;
  createdAt: Date;
}

const postSchema = new Schema<IPost>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    userPlantId: { type: Schema.Types.ObjectId, ref: "UserPlant", required: false },
    imageUrl: { type: String, required: true },
    caption: { type: String, default: "" },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const Post = model<IPost>("Post", postSchema);
