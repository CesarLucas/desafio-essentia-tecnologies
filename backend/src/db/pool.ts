import "../config/load-env";
import * as mysql from "mysql2/promise";
import { env } from "process";

export const pool = mysql.createPool({
  host: env.DB_HOST,
  port: env.DB_PORT ? Number(env.DB_PORT) : 3306,
  user: env.DB_USER,
  password: env.DB_PASSWORD,
  database: env.DB_NAME,
  connectionLimit: 10,
});
