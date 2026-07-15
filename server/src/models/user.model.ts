import mongoose from "mongoose";
import { USER_ROLES } from "../constants";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    type: {
      type: String,
      enum: Object.values(USER_ROLES),
    },
  },
  { timestamps: true }
);

const UserModel = mongoose.model("User", userSchema);

export default UserModel;
