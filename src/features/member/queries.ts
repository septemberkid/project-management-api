import { dbClient } from '@/drizzle';
import { tMembers } from '@/drizzle/schemas';
import { and, eq, ilike, sql, isNull, isNotNull } from 'drizzle-orm';
import { QueryMemberSchema } from '@/features/member/schema';
import { calculateTotalPages, getSortedFields } from '@/utils';

export const memberIsExist = async (email: string) => {
  return (await dbClient.$count(tMembers, eq(tMembers.email, email))) > 0;
};
export const getMember = async ({
  name,
  email,
  base_role,
  trashed,
  page = '1',
  size = '10',
  sort_by,
  sort_dir = 'asc',
}: QueryMemberSchema) => {
  const total = await dbClient.$count(
    tMembers,
    and(
      name && name.trim().length > 0
        ? ilike(tMembers.name, `%${name}%`)
        : undefined,
      email && email.trim().length > 0
        ? ilike(tMembers.email, `%${email}%`)
        : undefined,
      base_role && base_role.trim().length > 0
        ? eq(tMembers.base_role, base_role)
        : undefined,
      trashed && trashed.trim().length > 0 && trashed === '1'
        ? isNotNull(tMembers.deleted_at)
        : isNull(tMembers.deleted_at),
    ),
  );
  const { sortField, sortDir } = getSortedFields(
    sort_by,
    ['name', 'email', 'base_role'],
    'name',
    sort_dir,
  );

  const members = await dbClient.query.tMembers.findMany({
    limit: Number(size),
    offset: (Number(page) - 1) * Number(size),
    where: (s) => {
      return and(
        name && name.trim().length > 0 ? ilike(s.name, `%${name}%`) : undefined,
        email && email.trim().length > 0
          ? ilike(s.email, `%${email}%`)
          : undefined,
        base_role && base_role.trim().length > 0
          ? eq(s.base_role, base_role)
          : undefined,
        trashed && trashed.trim().length > 0 && trashed === '1'
          ? isNotNull(tMembers.deleted_at)
          : isNull(tMembers.deleted_at),
      );
    },
    orderBy: () => sql`${sql.identifier(sortField)} ${sql.raw(sortDir)}`,
  });
  const totalPages = calculateTotalPages(total, Number(size));
  return {
    total,
    members,
    total_pages: totalPages,
  };
};
export const retrieveMember = async (memberId: string) => {
  return dbClient.query.tMembers.findFirst({
    where: (s) => eq(s.id, memberId),
  });
};
