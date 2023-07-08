import {Pool} from "pg";

export class PostgresDriver {
  private postgresClient: Pool;
  private poolMaxConnections = 5;

  constructor(connectionString: string) {
    this.postgresClient = new  Pool({
      connectionString: connectionString,
      max: this.poolMaxConnections
    })
  }

  public async connect() {
    await this.postgresClient.connect()
  }

  public async close() {
    await this.postgresClient.end();
  }

  public getPostgresClient() {
    return this.postgresClient;
  }
}
