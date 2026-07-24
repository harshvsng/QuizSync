import UserModel from "../models/user.model";
import { ILoginPayload, ISignupPayload } from "../types/auth";
import bcryptjs from "bcryptjs";
import { signAccessToken } from "../utils/jwt";
import AppError from "../errors/app-error";
import { StatusCodes } from "http-status-codes";

export default class AuthService {
  private static instance: AuthService | null = null;

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  public async signup(payload: ISignupPayload) {
    const userExists = await UserModel.findOne({ email: payload.email });

    if (userExists) {
      throw new AppError("Email is already in use", StatusCodes.CONFLICT);
    }

    const hashedPassword = bcryptjs.hashSync(payload.password, 12);

    const { _id } = await UserModel.create({
      name: payload.name,
      email: payload.email,
      password: hashedPassword,
    });

    const accessToken = signAccessToken(_id.toString());

    return accessToken;
  }

  public async login(payload: ILoginPayload) {
    const userRecord = await UserModel.findOne({ email: payload.email }).select(
      "+password"
    );

    if (!userRecord) {
      throw new AppError(
        "Either email or password is wrong",
        StatusCodes.UNAUTHORIZED
      );
    }

    const passwordMatched = bcryptjs.compareSync(
      payload.password,
      userRecord.password
    );

    if (!passwordMatched) {
      throw new AppError(
        "Either email or password is wrong",
        StatusCodes.UNAUTHORIZED
      );
    }

    const accessToken = signAccessToken(userRecord._id.toString());

    return accessToken;
  }
}
