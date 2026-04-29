import * as dotenv from "dotenv";
import * as path from "node:path";

const envPaths = [
  path.resolve(process.cwd(), "backend/src/config/env/.env"),
  path.resolve(process.cwd(), "src/config/env/.env"),
  path.resolve(process.cwd(), ".env"),
];

for (const envPath of envPaths) {
  const result = dotenv.config({ path: envPath });
  if (!result.error) {
    break;
  }
}
