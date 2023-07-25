import { IUserData, User } from "@/entities/User";
import { IUserRepository } from "@/repositories/UserRepository";
import { Pool } from "pg";

export class PostgresUserRepository implements IUserRepository {
  private postgresClient: Pool;

  constructor(postgresClient: Pool) {
    this.postgresClient = postgresClient;
    this.sync();
  }

  private async sync() {
    await this.createTables();
  }

  private async createTables() {
    const sql = `CREATE TABLE IF NOT EXISTS users(
      _id VARCHAR(50) NOT NULL UNIQUE PRIMARY KEY,
      username VARCHAR(256) NOT NULL,
      email VARCHAR(50) NOT NULL UNIQUE,
      avatar_url VARCHAR(256),
      password VARCHAR(256),
      provider VARCHAR(15) NOT NULL
    )`;
    await this.postgresClient.query(sql);
  }

  save = async (user: User): Promise<void> => {
    const sql = `
      INSERT INTO users (_id, username, email, avatar_url, password, provider)
      VALUES ('${user._id}', '${user.username}', '${user.email}', '${user.avatarURL}','${user.password}', '${user.provider}')
    `;
    await this.postgresClient.query(sql);
  };

  findByEmail = async (email: string): Promise<User | null> => {
    const sql = `
      SELECT * FROM users WHERE email = '${email}' LIMIT 1
    `;
    const result = await this.postgresClient.query(sql);
    if (!result) throw new Error("Postgres Database returns null");

    if (result.rowCount < 1) return null;

    const userData: IUserData = {
      _id: result.rows[0]._id,
      username: result.rows[0].username,
      email: result.rows[0].email,
      avatarURL: result.rows[0].avatar_url,
      password: result.rows[0].password,
      provider: result.rows[0].provider,
    };

    return new User(userData);
  };
}
