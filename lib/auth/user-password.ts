import bcryptjs from "bcryptjs";

export async function hashPassword(plainPassowrd: string): Promise<string> {
  const salt = await bcryptjs.genSalt(10);
  const hashedPassword = await bcryptjs.hash(plainPassowrd, salt);
  return hashedPassword;
}

export async function isPasswordEqual(
  plainPassowrd?: string,
  hashedPassword?: string,
): Promise<boolean> {
  if (!plainPassowrd || !hashedPassword) return false;
  const result = await bcryptjs.compare(plainPassowrd, hashedPassword);
  return result;
}
