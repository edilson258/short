import { randomUUID } from "crypto"
import { hashPassword } from "@/lib/auth/user-password"

export interface IUserData {
  _id?: string
  username: string
  email: string
  password?: string
}

export class User {
  readonly _id: string
  readonly username: string
  readonly email: string
  readonly password?: string

  constructor(userData: IUserData) {
    if(userData._id) {
      this._id = userData._id
    } else {
      this._id = randomUUID()
    }
    this.username = userData.username
    this.email = userData.email

    if(userData.password)
      this.password = this.hashPassword(userData.password)
  }

  private hashPassword = (password: string) => {
    return hashPassword(password)
  }
}
