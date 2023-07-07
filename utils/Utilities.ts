import {postgresURLRepository} from "@/repositories/implementations/postgres";
import {TURLData} from "@/types/URLData";


export default class Utilities {
  public loadURLByHash = async(urlHash: string): Promise<TURLData | null> => {
    return await postgresURLRepository.queryURLByHash(urlHash)
  }
}
