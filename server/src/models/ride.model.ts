import mongoose from "mongoose";

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
    enum: ["Driver", "Passenger"],
  },
});

const UserModel = mongoose.model("User", userSchema);

export default UserModel;
