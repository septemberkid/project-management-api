import { dbClient } from '@/drizzle';
import { tClients } from '@/drizzle/schemas';
import { calculateTotalPages, getSortedFields } from '@/utils';
import {
  QueryClientOptionsSchema,
  QueryClientSchema,
} from '@/features/client/schema';
import { and, asc, eq, ilike, ne, sql } from 'drizzle-orm';

export const clientIsExist = async (clientId: string) => {
  return (await dbClient.$count(tClients, eq(tClients.id, clientId))) > 0;
};
export const getClient = async ({
  name,
  address,
  page = '1',
  size = '10',
  sort_by,
  sort_dir = 'asc',
}: QueryClientSchema) => {
  const total = await dbClient.$count(tClients);
  const { sortField, sortDir } = getSortedFields(
    sort_by,
    ['name'],
    'name',
    sort_dir,
  );
  const clients = await dbClient.query.tClients.findMany({
    limit: Number(size),
    offset: (Number(page) - 1) * Number(size),
    where: (s) => {
      return and(
        name && name.trim().length > 0 ? ilike(s.name, `%${name}%`) : undefined,
        address && address.trim().length > 0
          ? ilike(s.address, `%${address}%`)
          : undefined,
      );
    },
    orderBy: () => sql`${sql.identifier(sortField)} ${sql.raw(sortDir)}`,
  });
  const totalPages = calculateTotalPages(total, Number(size));
  return {
    total,
    clients,
    total_pages: totalPages,
  };
};
export const retrieveClient = async (clientId: string) => {
  return dbClient.query.tClients.findFirst({
    where: (s) => eq(s.id, clientId),
  });
};
export const getClientOptions = async ({
  name,
  client_id,
}: QueryClientOptionsSchema) => {
  let temps: Pick<typeof tClients.$inferSelect, 'id' | 'name'>[] = [];

  // pre-select purpose
  if (client_id) {
    const current = await dbClient.query.tClients.findFirst({
      columns: {
        id: true,
        name: true,
      },
      where: (s) => eq(s.id, client_id),
    });
    if (!current) {
      return;
    }
    temps.push(current);
  }

  // if search by name, clear temps
  if (name && name.length > 0) {
    temps = [];
  }

  const rows = await dbClient.query.tClients.findMany({
    columns: {
      id: true,
      name: true,
    },
    offset: 0,
    limit: temps.length > 0 ? 9 : 10,
    where: (s) => {
      return and(
        name && name.trim().length > 0 ? ilike(s.name, `%${name}%`) : undefined,
        client_id ? ne(s.id, client_id) : undefined,
      );
    },
    orderBy: (s) => asc(s.name),
  });

  temps.push(...rows);
  return temps;
};
