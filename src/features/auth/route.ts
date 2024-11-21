import { Hono } from 'hono';
import { addSeconds } from 'date-fns';
import { zValidator } from '@hono/zod-validator';
import { cookieMiddleware } from '@/cookie-middleware';
import { setCookie, deleteCookie } from 'hono/cookie';
import { signUp, signIn } from '@/features/auth/actions';
import { AUTH_COOKIE_NAME, SESSION_TIMEOUT } from '@/config';
import { signUpSchema, signInSchema } from '@/features/auth/schema';

const authRoutes = new Hono()
  .post('/sign-up', zValidator('json', signUpSchema), async (c) => {
    const payload = c.req.valid('json');
    const cookie = await signUp(payload);
    setCookie(c, AUTH_COOKIE_NAME, cookie, {
      path: '/',
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: SESSION_TIMEOUT,
      expires: addSeconds(new Date(), SESSION_TIMEOUT),
    });
    return c.json({
      message: 'Sign up successfully',
    });
  })
  .post('/sign-in', zValidator('json', signInSchema), async (c) => {
    const payload = c.req.valid('json');
    const cookie = await signIn(payload);
    setCookie(c, AUTH_COOKIE_NAME, cookie, {
      path: '/',
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: SESSION_TIMEOUT,
      expires: addSeconds(new Date(), SESSION_TIMEOUT),
    });
    return c.json({
      message: 'Sign in successfully',
    });
  })
  .post('/sign-out', cookieMiddleware, async (c) => {
    deleteCookie(c, AUTH_COOKIE_NAME);
    return c.json({
      message: 'Sign out successfully',
    });
  })
  .get('/session', cookieMiddleware, async (c) => {
    return c.json({
      user: c.get('user'),
    });
  });

export default authRoutes;
