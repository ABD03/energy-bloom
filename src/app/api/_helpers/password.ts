import bcrypt from "bcryptjs";

const ROUNDS = 10;
const BCRYPT_RE = /^\$2[aby]\$\d{2}\$/;

export function isHashed(value: string): boolean {
  return typeof value === "string" && BCRYPT_RE.test(value);
}

export async function hashPassword(plain: string): Promise<string> {
  if (!plain) return plain;
  if (isHashed(plain)) return plain;
  return bcrypt.hash(plain, ROUNDS);
}

export function hashPasswordSync(plain: string): string {
  if (!plain) return plain;
  if (isHashed(plain)) return plain;
  return bcrypt.hashSync(plain, ROUNDS);
}

export async function verifyPassword(
  plain: string,
  stored: string,
): Promise<boolean> {
  if (!plain || !stored) return false;
  if (isHashed(stored)) return bcrypt.compare(plain, stored);
  return plain === stored;
}
