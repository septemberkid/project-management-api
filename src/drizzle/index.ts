import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from '@/drizzle/schemas';
import { DB_CONNECTION } from '@/config';

export const dbClient = drizzle({
  schema,
  connection: DB_CONNECTION,
  logger: true,
});
