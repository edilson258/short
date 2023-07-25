import { randomUUID } from "crypto"

export type TLinkData = {
  _id?: string
  userID: string
  longLink: string
  longLinkHash: string
}

export default class Link {
  readonly _id: string;
  readonly userID: string;
  longLink: string;
  longLinkHash: string;

  constructor(linkData: TLinkData) {
    if(!linkData._id) {
      this._id = randomUUID()
    } else {
      this._id = linkData._id
    }
    this.longLink = linkData.longLink
    this.longLinkHash = linkData.longLinkHash
    this.userID = linkData.userID
  }
}
