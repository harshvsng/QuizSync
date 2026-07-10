import mongoose from "mongoose";
import { USER_ROLES } from "../constants";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      default: null,
    },
    phone: {
      type: String,
      required: true,
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
