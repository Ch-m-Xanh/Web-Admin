import { Schema, model, Types, Document } from "mongoose";

export interface IReminder {
  enabled: boolean;
  wateringIntervalDays?: number;
  fertilizingIntervalDays?: number;
  notifyTime?: string; // 'HH:mm'
}

export interface IUserPlant extends Document {
  userId: Types.ObjectId;
  plantId?: Types.ObjectId;
  customName: string;
  photoUrl: string;
  // Where the plant lives — 'indoor' | 'desk' | 'balcony' | 'garden' | 'other',
  // matches Mobile's constants/spaces.ts SPACE_OPTIONS keys.
  space?: string;
  // 'foliage' | 'flowering' | 'cactus' | 'herbs' | 'woody' | 'other',
  // matches Mobile's constants/plantCare.ts PLANT_GROUPS keys.
  plantGroup?: string;
  // 'direct' | 'indirect' | 'shade', matches Mobile's LIGHT_OPTIONS keys.
  light?: string;
  reminder: IReminder;
  addedAt: Date;
}

const reminderSchema = new Schema<IReminder>(
  {
    enabled: { type: Boolean, default: false },
    wateringIntervalDays: { type: Number, default: 3 },
    fertilizingIntervalDays: { type: Number, default: 30 },
    notifyTime: { type: String, default: "07:00" },
  },
  { _id: false }
);

const userPlantSchema = new Schema<IUserPlant>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
  plantId: { type: Schema.Types.ObjectId, ref: "Plant", required: false },
  customName: { type: String, required: true, trim: true },
  photoUrl: { type: String, required: true },
  space: { type: String, default: "" },
  plantGroup: { type: String, default: "" },
  light: { type: String, default: "" },
  reminder: { type: reminderSchema, default: () => ({}) },
  addedAt: { type: Date, default: Date.now },
});

export const UserPlant = model<IUserPlant>("UserPlant", userPlantSchema);
