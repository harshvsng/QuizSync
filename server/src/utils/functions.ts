import crypto from "crypto";

export const generateSecureOTP = (length: number) => {
  // Generates cryptographically strong random bytes
  const buffer = crypto.randomBytes(length);
  let otp = "";

  for (let i = 0; i < length; i++) {
    // Convert bytes to numbers between 0-9
    otp += buffer[i]! % 10;
  }
  return otp;
};
