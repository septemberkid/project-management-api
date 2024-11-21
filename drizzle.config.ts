import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  out: './sql',
  dialect: 'postgresql',
  schema: './src/drizzle/schemas/index.ts',
  dbCredentials: {
    url: process.env.DB_CONNECTION || '',
  },
  migrations: {
    table: '__migrations__',
  },
  breakpoints: true,
  strict: true,
});
