import bcryptjs from "bcryptjs";

export async function hashPassword(plainPassowrd: string): Promise<string> {
  const salt = await bcryptjs.genSalt(16);
  const hashedPassword = await bcryptjs.hash(plainPassowrd, salt);
  return hashedPassword;
}

export async function isPasswordEqual(
  plainPassowrd: string,
  hashedPassword: string,
): Promise<boolean> {
  const result = await bcryptjs.compare(plainPassowrd, hashedPassword);
  console.log("\n\n", result, "\n\n")
  return result
}
