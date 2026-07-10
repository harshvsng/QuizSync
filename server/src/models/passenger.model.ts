import mongoose from "mongoose";

const passengerSchema = new mongoose.Schema({
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

const PassengerModel = mongoose.model("Passenger", passengerSchema);

export default PassengerModel;
