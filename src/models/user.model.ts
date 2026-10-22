import mongoose from "mongoose";
import { User } from "../types/user.type";
import bcrypt from "bcrypt";

// it helps in login function for compare password error
interface UserDocument extends Omit<User, "_id">, Document {
  comparePassword(password: string): Promise<boolean>;
}

const userSchema = new mongoose.Schema<UserDocument>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      minlength: [5, "Email must be at least 5 characters long"],
    },
    password: {
      type: String,
      required: false,
      minlength: [6, "Password must be at least 6 characters long"],
    },
    mobile: {
      type: String,
      required: false,
    },
    googleId: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  },
);

userSchema.pre("save", async function () {
  if (!this.isModified("password") || !this.password) return;
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePassword = async function (password: string) {
  if (!this.password) return false;
  return await bcrypt.compare(password, this.password);
};

const UserModel =
  (mongoose.models.User as mongoose.Model<UserDocument>) ||
  mongoose.model<UserDocument>("User", userSchema);

export default UserModel;
