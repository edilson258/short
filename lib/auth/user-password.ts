import bcryptjs from "bcryptjs"

export function hashPassword(plainPassowrd: string) {
  const salt = bcryptjs.genSaltSync(16)
  const hashedPassword = bcryptjs.hashSync(plainPassowrd, salt)
  return hashedPassword
}

export function isPasswordEqual(plainPassowrd: string, hashedPassword: string) {
  return bcryptjs.compareSync(plainPassowrd, hashedPassword)
}
