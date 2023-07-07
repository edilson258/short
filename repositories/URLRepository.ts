import { TURLData } from "@/types/URLData";

export interface IURLRepository {
  storeURL: (urlData: TURLData) => Promise<void>;
  queryURLByHash: (longURLHash: string) => Promise<TURLData | null>;
}
