import { PostgresDriver } from "../PostgresDriver";
import { PostgresLinkRepository } from "./PostgresLinkRepository";

const PG_CONNECTION_STRING = process.env.PG_CONNECTION_STRING;
if (!PG_CONNECTION_STRING)
  throw new Error("Failed to load PG_CONNECTION_STRING from .env");

const postgresDriver = new PostgresDriver(PG_CONNECTION_STRING);

const postgresLinkRepository = new PostgresLinkRepository(
  postgresDriver.getPostgresClient()
);

export { postgresLinkRepository };
