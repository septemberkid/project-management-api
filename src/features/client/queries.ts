import { dbClient } from '@/drizzle';
import { tClients } from '@/drizzle/schemas';
import { calculateTotalPages } from '@/utils';
import { QueryClientSchema } from '@/features/client/schema';
import { and, asc, desc, ilike } from 'drizzle-orm';

export const getClient = async ({
  name,
  address,
  page = '1',
  size = '10',
  sort_dir = 'asc',
}: QueryClientSchema) => {
  const total = await dbClient.$count(tClients);
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
    orderBy: (s) => {
      if (sort_dir == 'asc') {
        return asc(s.name);
      }
      return desc(s.name);
    },
  });
  const totalPages = calculateTotalPages(total, Number(size));
  return {
    total,
    clients,
    total_pages: totalPages,
  };
};
