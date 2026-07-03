import mongoose from "mongoose";

export async function connectDB() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("Thieu bien moi truong MONGODB_URI");
  }
  await mongoose.connect(uri);
  // eslint-disable-next-line no-console
  console.log("[DB] Ket noi MongoDB thanh cong");
}
