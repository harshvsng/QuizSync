import { StatusCodes } from "http-status-codes";
import AppError from "../errors/app-error";
import OTPModel from "../models/otp.model";
import { ISendOTP } from "../types/services/auth";
import { utcTime } from "../utils/time";
import { generateSecureOTP } from "../utils/functions";
import UserModel from "../models/user.model";

export default class AuthService {
  // 1. Hold the single instance in a private static property
  private static instance: AuthService | null = null;

  // 2. Make the constructor private to block 'new AuthService()'
  private constructor() {}

  // 3. Provide a public static method to control access
  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  async sendOTP(payload: ISendOTP) {
    let userRecord = await UserModel.findOne({ phone: payload.phone });

    if (!userRecord) {
      userRecord = await UserModel.create({
        phone: payload.phone,
        type: payload.type,
      });
    }
    const count = await OTPModel.countDocuments({
      userId: userRecord._id,
      createdAt: { $gte: utcTime().subtract(15, "minute").toDate() },
      isValid: true,
    });

    if (count >= 3) {
      throw new AppError(
        `OTP send limit exceeded. Please, try again in some time.`,
        StatusCodes.TOO_MANY_REQUESTS
      );
    }

    const otpRef = (
      await OTPModel.create({
        userId: userRecord._id,
        value: generateSecureOTP(4),
      })
    )._id;

    return otpRef;
  }
}
