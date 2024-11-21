import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { getClient, retrieveClient } from '@/features/client/queries';
import { cookieMiddleware } from '@/cookie-middleware';
import {
  createClientSchema,
  queryClientSchema,
  updateClientSchema,
} from '@/features/client/schema';
import {
  createClient,
  deleteClient,
  updateClient,
} from '@/features/client/actions';
import { HTTPException } from 'hono/http-exception';

const clientRoutes = new Hono()
  .get(
    '/',
    cookieMiddleware,
    zValidator('query', queryClientSchema),
    async (c) => {
      const query = c.req.valid('query');
      const result = await getClient(query);
      return c.json(result);
    },
  )
  .get('/:clientId', cookieMiddleware, async (c) => {
    const { clientId } = c.req.param();
    const result = await retrieveClient(clientId);
    if (!result) {
      throw new HTTPException(404, {
        message: 'Client not found',
      });
    }
    return c.json(result);
  })
  .post(
    '/',
    cookieMiddleware,
    zValidator('json', createClientSchema),
    async (c) => {
      const payload = c.req.valid('json');
      const client = await createClient(payload);
      return c.json({
        message: 'Client created successfully',
        client,
      });
    },
  )
  .patch(
    '/:clientId',
    cookieMiddleware,
    zValidator('json', updateClientSchema),
    async (c) => {
      const { clientId } = c.req.param();
      const payload = c.req.valid('json');
      const client = await updateClient(clientId, payload);
      return c.json({
        message: 'Client updated successfully',
        client,
      });
    },
  )
  .delete('/:clientId', cookieMiddleware, async (c) => {
    const { clientId } = c.req.param();
    const client = await deleteClient(clientId);
    return c.json({
      message: 'Client deleted successfully',
      client,
    });
  });

export default clientRoutes;
