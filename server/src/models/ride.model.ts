import mongoose, { Types } from "mongoose";
import { RIDE_STATUS } from "../constants";

const rideSchema = new mongoose.Schema(
  {
    passenger: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },

    driver: {
      type: Types.ObjectId,
      ref: "User",
      default: null,
    },

    vehicle: {
      type: Types.ObjectId,
      ref: "Vehicle",
      default: null,
    },

    pickupAddress: {
      type: String,
      required: true,
    },

    pickupCoords: {
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

    dropAddress: {
      type: String,
      required: true,
    },

    dropCoords: {
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

    estimatedDistance: {
      type: Number,
      required: true,
    },

    estimatedDuration: {
      type: Number,
      required: true,
    },

    fare: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: Object.values(RIDE_STATUS),
      default: RIDE_STATUS.SEARCHING,
    },

    acceptedAt: Date,

    startedAt: Date,

    completedAt: Date,

    cancelledAt: Date,
  },
  {
    timestamps: true,
  }
);

rideSchema.index({
  pickupCoords: "2dsphere",
});

const RideModel = mongoose.model("Ride", rideSchema);

export default RideModel;
