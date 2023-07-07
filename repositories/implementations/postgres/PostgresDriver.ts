import * as pg from "pg";
import {Sequelize} from "sequelize";

export class PostgresDriver {
  private postgresClient: Sequelize;

  constructor(connectionString: string) {
    this.postgresClient = new Sequelize(connectionString, {
      dialectModule: pg
    });
  }

  public async connect() {
    await this.postgresClient.authenticate();
  }

  public async close() {
    await this.postgresClient.close();
  }

  public getPostgresClient() {
    return this.postgresClient;
  }
}
