import { Schema, model, Types, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash: string;
  avatarUrl?: string;
  role: "user" | "admin";
  gardenName?: string;
  followerIds: Types.ObjectId[];
  followingIds: Types.ObjectId[];
  isLocked: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    avatarUrl: { type: String, default: "" },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    gardenName: { type: String, default: "" },
    followerIds: [{ type: Schema.Types.ObjectId, ref: "User", default: [] }],
    followingIds: [{ type: Schema.Types.ObjectId, ref: "User", default: [] }],
    isLocked: { type: Boolean, default: false },
  },
  { timestamps: true }
);

userSchema.set("toJSON", {
  transform: (_doc, ret: any) => {
    delete ret.passwordHash;
    return ret;
  },
});

export const User = model<IUser>("User", userSchema);
