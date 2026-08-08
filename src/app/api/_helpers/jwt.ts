import { SignJWT, jwtVerify, type JWTPayload } from "jose";

function getSecret() {
  const key = process.env.NEXT_PUBLIC_ENCRYPT_KEY;
  if (!key) {
    throw new Error(
      "NEXT_PUBLIC_ENCRYPT_KEY is not set. Complete /get-started and restart the dev server.",
    );
  }
  return new TextEncoder().encode(key);
}

export interface TokenPayload extends JWTPayload {
  userId: string;
  email: string;
  role?: string;
}

export async function signToken(payload: Omit<TokenPayload, keyof JWTPayload>) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(getSecret());
}

export async function verifyToken(token: string): Promise<TokenPayload> {
  const { payload } = await jwtVerify(token, getSecret());
  return payload as TokenPayload;
}
