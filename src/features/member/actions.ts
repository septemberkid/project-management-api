import { and, eq, ne } from 'drizzle-orm';
import {
  CreateMemberSchema,
  UpdateMemberSchema,
} from '@/features/member/schema';
import { dbClient } from '@/drizzle';
import { HTTPException } from 'hono/http-exception';
import { tMembers } from '@/drizzle/schemas';
import { memberIsExist } from '@/features/member/queries';

export const createMember = async ({
  name,
  email,
  base_role,
}: CreateMemberSchema): Promise<typeof tMembers.$inferInsert> => {
  const isMemberExist = await memberIsExist(email);
  if (isMemberExist) {
    throw new HTTPException(400, {
      message: 'Member already exist',
    });
  }
  const result = await dbClient
    .insert(tMembers)
    .values({
      name,
      email,
      base_role,
    })
    .returning();
  return result[0] satisfies typeof tMembers.$inferInsert;
};
export const updateMember = async (
  id: string,
  { name, email, base_role }: UpdateMemberSchema,
): Promise<typeof tMembers.$inferSelect> => {
  const exist = (await dbClient.$count(tMembers, eq(tMembers.id, id))) > 0;
  if (!exist) {
    throw new HTTPException(404, {
      message: 'Data not found',
    });
  }
  const isEmailExist =
    (await dbClient.$count(
      tMembers,
      and(eq(tMembers.email, email), ne(tMembers.id, id)),
    )) > 0;
  if (isEmailExist) {
    throw new HTTPException(404, {
      message: 'Email already taken',
    });
  }
  const result = await dbClient
    .update(tMembers)
    .set({
      name,
      email,
      base_role,
      modified_at: new Date(),
    })
    .where(eq(tMembers.id, id))
    .returning();
  return result[0] satisfies typeof tMembers.$inferSelect;
};
export const deleteMember = async (
  id: string,
): Promise<typeof tMembers.$inferSelect> => {
  const exist = (await dbClient.$count(tMembers, eq(tMembers.id, id))) > 0;
  if (!exist) {
    throw new HTTPException(404, {
      message: 'Data not found',
    });
  }
  const result = await dbClient
    .update(tMembers)
    .set({
      modified_at: new Date(),
      deleted_at: new Date(),
    })
    .where(eq(tMembers.id, id))
    .returning();
  return result[0] satisfies typeof tMembers.$inferSelect;
};

export const restoreMember = async (
  id: string,
): Promise<typeof tMembers.$inferSelect> => {
  const exist = (await dbClient.$count(tMembers, eq(tMembers.id, id))) > 0;
  if (!exist) {
    throw new HTTPException(404, {
      message: 'Data not found',
    });
  }
  const result = await dbClient
    .update(tMembers)
    .set({
      modified_at: new Date(),
      deleted_at: null,
    })
    .where(eq(tMembers.id, id))
    .returning();
  return result[0] satisfies typeof tMembers.$inferSelect;
};
