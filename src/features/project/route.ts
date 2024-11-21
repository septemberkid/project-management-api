import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { getProject, retrieveProject } from '@/features/project/queries';
import { cookieMiddleware } from '@/cookie-middleware';
import {
  createProjectSchema,
  queryProjectSchema,
  updateProjectSchema,
} from '@/features/project/schema';
import {
  createProject,
  deleteProject,
  updateProject,
} from '@/features/project/actions';
import { HTTPException } from 'hono/http-exception';

const projectRoutes = new Hono()
  .get(
    '/',
    cookieMiddleware,
    zValidator('query', queryProjectSchema),
    async (c) => {
      const query = c.req.valid('query');
      const result = await getProject(query);
      return c.json(result);
    },
  )
  .get('/:projectId', cookieMiddleware, async (c) => {
    const { projectId } = c.req.param();
    const result = await retrieveProject(projectId);
    if (!result) {
      throw new HTTPException(404, {
        message: 'Project not found',
      });
    }
    return c.json(result);
  })
  .post(
    '/',
    cookieMiddleware,
    zValidator('json', createProjectSchema),
    async (c) => {
      const payload = c.req.valid('json');
      const project = await createProject(payload);
      return c.json({
        message: 'Project created successfully',
        project,
      });
    },
  )
  .patch(
    '/:projectId',
    cookieMiddleware,
    zValidator('json', updateProjectSchema),
    async (c) => {
      const { projectId } = c.req.param();
      const payload = c.req.valid('json');
      const client = await updateProject(projectId, payload);
      return c.json({
        message: 'Project updated successfully',
        client,
      });
    },
  )
  .delete('/:projectId', cookieMiddleware, async (c) => {
    const { projectId } = c.req.param();
    const client = await deleteProject(projectId);
    return c.json({
      message: 'Project deleted successfully',
      client,
    });
  });

export default projectRoutes;
