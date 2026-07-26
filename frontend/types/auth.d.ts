export interface ISignupPayload {
  name: string;
  email: string;
  password: string;
}
export interface ILoginPayload {
  email: string;
  password: string;
}
export interface IUserSession {
  _id: string;
  name: string;
  email: string;
}
