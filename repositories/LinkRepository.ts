import Link from "@/entities/Link";

export interface ILinkRepository {
  storeLink: (link: Link) => Promise<void>;
  queryLinkByHash: (longLinkHash: string) => Promise<Link | null>;
  listLinksByUserID: (userID: string) => Promise<Link[]>
}
