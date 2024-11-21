import { eq } from 'drizzle-orm';
import { dbClient } from '@/drizzle';

export const getUser = (id: string) => {
  return dbClient.query.tUsers.findFirst({
    columns: {
      id: true,
      name: true,
      email: true,
    },
    where: (s) => eq(s.id, id),
  });
};
