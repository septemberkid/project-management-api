import { dbClient } from '@/drizzle';
import { tProjects } from '@/drizzle/schemas';
import { calculateTotalPages, getSortedFields } from '@/utils';
import { QueryProjectSchema } from '@/features/project/schema';
import { and, eq, ilike, sql } from 'drizzle-orm';

export const getProject = async ({
  name,
  client_id,
  page = '1',
  size = '10',
  sort_by,
  sort_dir = 'asc',
}: QueryProjectSchema) => {
  const total = await dbClient.$count(
    tProjects,
    and(
      name && name.trim().length > 0
        ? ilike(tProjects.name, `%${name}%`)
        : undefined,
      client_id && client_id.trim().length > 0
        ? eq(tProjects.client_id, client_id)
        : undefined,
    ),
  );
  const { sortField, sortDir } = getSortedFields(
    sort_by,
    ['name', 'start_date', 'end_date'],
    'name',
    sort_dir,
  );

  const projects = await dbClient.query.tProjects.findMany({
    limit: Number(size),
    offset: (Number(page) - 1) * Number(size),
    where: (s) => {
      return and(
        name && name.trim().length > 0 ? ilike(s.name, `%${name}%`) : undefined,
        client_id && client_id.trim().length > 0
          ? eq(s.client_id, client_id)
          : undefined,
      );
    },
    orderBy: () => sql`${sql.identifier(sortField)} ${sql.raw(sortDir)}`,
    with: {
      client: {
        columns: {
          id: true,
          name: true,
        },
      },
    },
  });
  const totalPages = calculateTotalPages(total, Number(size));
  return {
    total,
    projects,
    total_pages: totalPages,
  };
};
export const retrieveProject = async (projectId: string) => {
  return dbClient.query.tProjects.findFirst({
    where: (s) => eq(s.id, projectId),
  });
};
