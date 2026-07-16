export interface ISignupPayload {
  name: string;
  email: string;
  password: string;
  type: string;
}

export interface ILoginPayload {
  email: string;
  password: string;
}
