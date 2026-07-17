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

export interface ISession {
  _id: string;
  name: string;
  email: string;
  type: string;
}
