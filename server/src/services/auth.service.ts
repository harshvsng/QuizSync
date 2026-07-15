import UserModel from "../models/user.model";
import { ISignupPayload } from "../types/auth";
import bcryptjs from "bcryptjs";
import { signAccessToken } from "../utils/jwt";

export default class AuthService {
  private static instance: AuthService | null = null;

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  public async signup(payload: ISignupPayload) {
    const hashedPassword = bcryptjs.hashSync(payload.password, 12);

    const { _id } = await UserModel.create({
      name: payload.name,
      email: payload.email,
      password: hashedPassword,
      type: payload.type,
    });

    const accessToken = signAccessToken(_id.toString());

    return accessToken;
  }
}
