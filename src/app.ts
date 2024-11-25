import { Hono } from 'hono';
import { cors } from 'hono/cors';
import authRoutes from '@/features/auth/route';
import { StatusCode } from 'hono/utils/http-status';
import { HTTPException } from 'hono/http-exception';
import clientRoutes from '@/features/client/route';
import projectRoutes from '@/features/project/route';
import memberRoutes from '@/features/member/route';

const app = new Hono().basePath('/api/v1');

app.use(
  '*',
  cors({
    origin: process.env.ALLOWED_ORIGINS?.split(',') || [],
    credentials: true,
    allowHeaders: ['Content-Type'],
  }),
);

app.notFound((c) => {
  return c.json(
    {
      message: 'Route not found.',
    },
    404,
  );
});
app.onError((err, c) => {
  let statusCode: StatusCode = 500;
  if (err instanceof HTTPException) {
    statusCode = err.status;
  }

  return c.json(
    {
      message: err.message,
    },
    statusCode,
  );
});
app.route('/auth', authRoutes);
app.route('/clients', clientRoutes);
app.route('/projects', projectRoutes);
app.route('/members', memberRoutes);

export default {
  port: 8787,
  fetch: app.fetch,
};
