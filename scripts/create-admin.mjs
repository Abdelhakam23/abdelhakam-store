import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const required = (name) => {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`${name} is required`);
  return value;
};

const uri = required("MONGODB_URI");
const dbName = process.env.MONGODB_DB_NAME?.trim() || "ecommerce_store";
const email = required("ADMIN_EMAIL").toLowerCase();
const password = required("ADMIN_PASSWORD");
const name = process.env.ADMIN_NAME?.trim() || "Abdelhakam Store Admin";

if (password.length < 8) throw new Error("ADMIN_PASSWORD must be at least 8 characters");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true, select: false },
    role: { type: String, enum: ["customer", "admin"], default: "customer" },
  },
  { timestamps: true, collection: "users" },
);

const User = mongoose.models.User || mongoose.model("User", userSchema);

try {
  await mongoose.connect(uri, { dbName, bufferCommands: false });
  const passwordHash = await bcrypt.hash(password, 12);
  const user = await User.findOneAndUpdate(
    { email },
    { $set: { name, passwordHash, role: "admin" } },
    { new: true, upsert: true, setDefaultsOnInsert: true },
  ).select("_id email role");
  console.log(`Admin ready: ${user.email} (${user._id})`);
} finally {
  await mongoose.disconnect();
}
