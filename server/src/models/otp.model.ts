import mongoose, { Types } from "mongoose";
import { required } from "zod/mini";

const otpSchema = new mongoose.Schema(
  {
    userId: {
      type: Types.ObjectId,
      required: true,
    },
    value: {
      type: String,
      required: true,
    },
    isValid: {
      type: Boolean,
      default: true,
    },
    attempts: {
      type: Number,
      default: 3,
    },
  },
  { timestamps: true }
);

otpSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 * 60 }); // 1 hour

const OTPModel = mongoose.model("OTP", otpSchema);

export default OTPModel;
