import mongoose from "mongoose";

const driverSchema = new mongoose.Schema({
  vehicleDetails: {
    regNumber: {
      type: String,
      required: true,
    },
    location: {
      coordinates: {
        lat: {
          type: Number,
          required: true,
        },
        lng: {
          type: Number,
          required: true,
        },
      },
    },
  },
});

const DriverModel = mongoose.model("Driver", driverSchema);

export default DriverModel;
