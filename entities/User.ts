import { randomUUID } from "crypto";

export interface IUserData {
  _id?: string;
  username: string;
  email: string;
  password: string;
}

export class User {
  readonly _id: string;
  username: string;
  email: string;
  password: string;

  constructor(userData: IUserData) {
    if (userData._id) {
      this._id = userData._id;
    } else {
      this._id = randomUUID();
    }
    this.username = userData.username;
    this.email = userData.email;
    this.password = userData.password
  }
}
