import mongoose from "mongoose";
import { User } from "../types/user.type";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema<User>(
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
      required: true,
      minlength: [8, "Password must be at least 8 characters long"],
    },
    mobile: {
      type: String,
      required: false,
      minlength: [10, "Mobile number must be at least 10 characters long"],
    },
  },
  {
    timestamps: true,
  },
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = bcrypt.hashSync(this.password, 10);
});

userSchema.methods.comparePassword = async function (password: string) {
  return bcrypt.compareSync(password, this.password);
};

const UserModel = mongoose.model<User>("User", userSchema);

export default UserModel;
