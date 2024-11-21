import {
  CreateProjectSchema,
  UpdateProjectSchema,
} from '@/features/project/schema';
import { dbClient } from '@/drizzle';
import { tProjects } from '@/drizzle/schemas';
import { eq } from 'drizzle-orm';
import { HTTPException } from 'hono/http-exception';
import { format } from 'date-fns';
import { clientIsExist } from '@/features/client/queries';

export const createProject = async ({
  name,
  description,
  start_date,
  end_date,
  client_id,
}: CreateProjectSchema): Promise<typeof tProjects.$inferInsert> => {
  const isClientExist = await clientIsExist(client_id);
  if (!isClientExist) {
    throw new HTTPException(404, {
      message: 'Client not found',
    });
  }
  const result = await dbClient
    .insert(tProjects)
    .values({
      name,
      description,
      client_id,
      start_date:
        start_date instanceof Date ? format(start_date, 'yyyy-MM-dd') : null,
      end_date:
        end_date instanceof Date ? format(end_date, 'yyyy-MM-dd') : null,
    })
    .returning();
  return result[0] satisfies typeof tProjects.$inferInsert;
};
export const updateProject = async (
  id: string,
  { name, description, start_date, end_date, client_id }: UpdateProjectSchema,
): Promise<typeof tProjects.$inferSelect> => {
  const isClientExist = await clientIsExist(client_id);
  if (!isClientExist) {
    throw new HTTPException(404, {
      message: 'Client not found',
    });
  }
  const exist = (await dbClient.$count(tProjects, eq(tProjects.id, id))) > 0;
  if (!exist) {
    throw new HTTPException(404, {
      message: 'Data not found',
    });
  }
  const result = await dbClient
    .update(tProjects)
    .set({
      name,
      description,
      client_id,
      start_date:
        start_date instanceof Date ? format(start_date, 'yyyy-MM-dd') : null,
      end_date:
        end_date instanceof Date ? format(end_date, 'yyyy-MM-dd') : null,
      modified_at: new Date(),
    })
    .where(eq(tProjects.id, id))
    .returning();
  return result[0] satisfies typeof tProjects.$inferSelect;
};
export const deleteProject = async (
  id: string,
): Promise<typeof tProjects.$inferSelect> => {
  const exist = (await dbClient.$count(tProjects, eq(tProjects.id, id))) > 0;
  if (!exist) {
    throw new HTTPException(404, {
      message: 'Data not found',
    });
  }
  const result = await dbClient
    .delete(tProjects)
    .where(eq(tProjects.id, id))
    .returning();
  return result[0] satisfies typeof tProjects.$inferSelect;
};
