import { PostgresDriver } from "../PostgresDriver";
import { PostgresURLRepository } from "./PostgresURLRepository";

const PG_CONNECTION_STRING = process.env.PG_CONNECTION_STRING;
if (!PG_CONNECTION_STRING)
  throw new Error("Failed to load PG_CONNECTION_STRING from .env");

const postgresDriver = new PostgresDriver(PG_CONNECTION_STRING);

const postgresURLRepository = new PostgresURLRepository(
  postgresDriver.getPostgresClient()
);

export { postgresURLRepository };
