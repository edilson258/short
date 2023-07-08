import {IURLRepository} from "@/repositories/URLRepository";
import {TURLData} from "@/types/URLData";
import {Pool} from "pg";

export class PostgresURLRepository implements IURLRepository {
  private postgresClient: Pool;

  constructor(postgresClient: Pool) {
    this.postgresClient = postgresClient;
    this.createTables();
  }

  private createTables = async () => {
    await this.postgresClient.query(`
      CREATE TABLE IF NOT EXISTS urls (
        _id VARCHAR(256),
        longurl TEXT,
        longurlhash VARCHAR(256)
      );
    `);
  };

  public storeURL = async (urlData: TURLData): Promise<void> => {
    const queryText = `
      INSERT INTO urls (_id, longurl, longurlhash)
      VALUES ('${urlData._id}', '${urlData.longURL}', '${urlData.longURLHash}');
    `;
    await this.postgresClient.query(queryText);
  };

  public queryURLByHash = async (
    longURLHash: string
  ): Promise<TURLData | null> => {
    const queryText = `
      SELECT * FROM urls WHERE longurlhash = '${longURLHash}' LIMIT 1;
    `;
    const result = await this.postgresClient.query(queryText);
    if (result.rowCount < 1) return null;
    const row = result.rows[0];
    const url: TURLData = {
      _id: row._id,
      longURL: row.longurl,
      longURLHash: row.longurlhash,
    };
    return url;
  };
}
