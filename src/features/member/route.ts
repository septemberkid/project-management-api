import { Hono } from 'hono';
import {
  createMemberSchema,
  queryMemberSchema,
  updateMemberSchema,
} from '@/features/member/schema';
import {
  createMember,
  deleteMember,
  restoreMember,
  updateMember,
} from '@/features/member/actions';
import { zValidator } from '@hono/zod-validator';
import { getMember, retrieveMember } from '@/features/member/queries';
import { cookieMiddleware } from '@/cookie-middleware';

const memberRoutes = new Hono()
  .get(
    '/',
    cookieMiddleware,
    zValidator('query', queryMemberSchema),
    async (c) => {
      const query = c.req.valid('query');
      const result = await getMember(query);
      return c.json(result);
    },
  )
  .get('/:memberId', cookieMiddleware, async (c) => {
    const { memberId } = c.req.param();
    const result = await retrieveMember(memberId);
    return c.json(result);
  })
  .post(
    '/',
    cookieMiddleware,
    zValidator('json', createMemberSchema),
    async (c) => {
      const payload = c.req.valid('json');
      const member = await createMember(payload);
      return c.json({
        message: 'Member created successfully',
        member,
      });
    },
  )
  .patch(
    '/:memberId',
    cookieMiddleware,
    zValidator('json', updateMemberSchema),
    async (c) => {
      const { memberId } = c.req.param();
      const payload = c.req.valid('json');
      const member = await updateMember(memberId, payload);
      return c.json({
        message: 'Member updated successfully',
        member,
      });
    },
  )
  .delete('/:memberId', cookieMiddleware, async (c) => {
    const { memberId } = c.req.param();
    const member = await deleteMember(memberId);
    return c.json({
      message: 'Member deleted successfully',
      member,
    });
  })
  .post('/restore/:memberId', cookieMiddleware, async (c) => {
    const { memberId } = c.req.param();
    const member = await restoreMember(memberId);
    return c.json({
      message: 'Member restored successfully',
      member,
    });
  });

export default memberRoutes;
