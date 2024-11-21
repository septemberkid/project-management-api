import {
  CreateClientSchema,
  UpdateClientSchema,
} from '@/features/client/schema';
import { dbClient } from '@/drizzle';
import { tClients } from '@/drizzle/schemas';
import { eq } from 'drizzle-orm';
import { HTTPException } from 'hono/http-exception';

export const createClient = async ({
  name,
  email,
  address,
  website,
  phone,
  fax,
}: CreateClientSchema): Promise<typeof tClients.$inferInsert> => {
  const result = await dbClient
    .insert(tClients)
    .values({
      name,
      email,
      address,
      website,
      phone_number: phone,
      fax_number: fax,
    })
    .returning();
  return result[0] satisfies typeof tClients.$inferInsert;
};
export const updateClient = async (
  id: string,
  { name, email, address, website, phone, fax }: UpdateClientSchema,
): Promise<typeof tClients.$inferSelect> => {
  const exist = (await dbClient.$count(tClients, eq(tClients.id, id))) > 0;
  if (!exist) {
    throw new HTTPException(404, {
      message: 'Data not found',
    });
  }
  const result = await dbClient
    .update(tClients)
    .set({
      name,
      email,
      address,
      website,
      phone_number: phone,
      fax_number: fax,
    })
    .where(eq(tClients.id, id))
    .returning();
  return result[0] satisfies typeof tClients.$inferSelect;
};
export const deleteClient = async (
  id: string,
): Promise<typeof tClients.$inferSelect> => {
  const exist = (await dbClient.$count(tClients, eq(tClients.id, id))) > 0;
  if (!exist) {
    throw new HTTPException(404, {
      message: 'Data not found',
    });
  }
  const result = await dbClient
    .delete(tClients)
    .where(eq(tClients.id, id))
    .returning();
  return result[0] satisfies typeof tClients.$inferSelect;
};
