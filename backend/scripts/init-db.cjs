const fs = require('node:fs/promises');
const path = require('node:path');
const dotenv = require('dotenv');
const mysql = require('mysql2/promise');

function splitSqlStatements(sql) {
  return sql
    .replace(/^\uFEFF/, '')
    .split(';')
    .map((statement) => statement.trim())
    .filter(Boolean);
}

async function main() {
  const projectRoot = path.resolve(__dirname, '..', '..');
  const envPath = path.resolve(projectRoot, 'backend', 'src', 'config', 'env', '.env');
  dotenv.config({ path: envPath });

  const host = process.env.DB_HOST || '127.0.0.1';
  const port = Number(process.env.DB_PORT || 3306);
  const user = process.env.DB_USER;
  const password = process.env.DB_PASSWORD;
  const database = process.env.DB_NAME;

  if (!user || !database) {
    throw new Error('DB_USER e DB_NAME precisam estar configurados no .env');
  }

  const schemaPath = path.resolve(projectRoot, 'backend', 'src', 'db', '001_schema.sql');
  const seedPath = path.resolve(projectRoot, 'backend', 'src', 'db', '002_seed.sql');

  const [schemaSql, seedSql] = await Promise.all([
    fs.readFile(schemaPath, 'utf8'),
    fs.readFile(seedPath, 'utf8'),
  ]);

  const connection = await mysql.createConnection({
    host,
    port,
    user,
    password,
    multipleStatements: true,
  });

  try {
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\``);
    await connection.query(`USE \`${database}\``);

    const schemaStatements = splitSqlStatements(schemaSql);
    for (const statement of schemaStatements) {
      await connection.query(statement);
    }

    const seedStatements = splitSqlStatements(seedSql);
    for (const statement of seedStatements) {
      await connection.query(statement);
    }

    console.log('[db:init] Banco, schema e seed aplicados com sucesso.');
  } finally {
    await connection.end();
  }
}

main().catch((error) => {
  console.error('[db:init] Falha ao inicializar banco:', error.message);
  process.exit(1);
});
