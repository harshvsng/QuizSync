import mongoose from "mongoose";
import { USER_ROLE } from "../constants";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: USER_ROLE,
  },
});

const UserModel = mongoose.model("User", userSchema);

export default UserModel;
