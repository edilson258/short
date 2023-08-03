import Link from "@/entities/Link";
import { ILinkRepository } from "@/repositories/LinkRepository";
import { Pool } from "pg";

export class PostgresLinkRepository implements ILinkRepository {
  private postgresClient: Pool;

  constructor(postgresClient: Pool) {
    this.postgresClient = postgresClient;
    this.sync();
  }

  private sync = async () => {
    await this.createTables();
  };

  private createTables = async () => {
    await this.postgresClient.query(`
      CREATE TABLE IF NOT EXISTS links (
        _id VARCHAR(50) NOT NULL UNIQUE,
        user_id VARCHAR(50) NOT NULL REFERENCES users (_id),
        long_link TEXT NOT NULL,
        long_link_hash VARCHAR(256) NOT NULL
      );
    `);
  };

  public storeLink = async (link: Link): Promise<void> => {
    await this.sync();
    const queryText = `
      INSERT INTO links (_id, user_id,  long_link, long_link_hash)
      VALUES ('${link._id}', '${link.userID}', '${link.longLink}', '${link.longLinkHash}');
    `;
    await this.postgresClient.query(queryText);
  };

  public queryLinkByHash = async (
    longLinkHash: string,
  ): Promise<Link | null> => {
    const queryText = `
      SELECT * FROM links WHERE long_link_hash = '${longLinkHash}' LIMIT 1;
    `;
    const result = await this.postgresClient.query(queryText);
    if (result.rowCount < 1) return null;
    const row = result.rows[0];
    return new Link({
      _id: row._id,
      userID: row.user_id,
      longLink: row.long_link,
    });
  };

  public listLinksByUserID = async (userID: string): Promise<Link[]> => {
    await this.sync();
    const sql = `SELECT * FROM links WHERE user_id = '${userID}'`;
    const result = await this.postgresClient.query(sql);
    if (!result) return [];
    const links: Link[] = result.rows.map((row) => {
      return new Link({
        _id: row._id,
        userID: row.user_id,
        longLink: row.long_link,
      });
    });
    return links;
  };
}
