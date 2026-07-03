import { Schema, model, Types, Document } from "mongoose";

export interface IChatMessage extends Document {
  userId: Types.ObjectId;
  sender: "user" | "bot";
  text: string;
  createdAt: Date;
}

const chatMessageSchema = new Schema<IChatMessage>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    sender: { type: String, enum: ["user", "bot"], required: true },
    text: { type: String, required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const ChatMessage = model<IChatMessage>("ChatMessage", chatMessageSchema);
