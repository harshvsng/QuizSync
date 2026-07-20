import mongoose, { Types } from "mongoose";
import { VEHICLE_STATUS } from "../constants";

const vehicleSchema = new mongoose.Schema(
  {
    driver: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    registrationNumber: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },

    manufacturer: {
      type: String,
      required: true,
    },

    model: {
      type: String,
      required: true,
    },

    color: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: Object.values(VEHICLE_STATUS),
      default: VEHICLE_STATUS.OFFLINE,
    },

    currentLocation: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },

      coordinates: {
        type: [Number],
        required: true,
      },
    },
  },
  {
    timestamps: true,
  }
);

vehicleSchema.index({
  currentLocation: "2dsphere",
});

const VehicleModel = mongoose.model("Vehicle", vehicleSchema);

export default VehicleModel;
