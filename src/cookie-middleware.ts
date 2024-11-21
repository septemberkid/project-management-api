import { addSeconds } from 'date-fns';
import { createMiddleware } from 'hono/factory';
import { getUser } from '@/features/auth/queries';
import { getCookie, setCookie } from 'hono/cookie';
import { HTTPException } from 'hono/http-exception';
import { AUTH_COOKIE_NAME, SESSION_TIMEOUT } from '@/config';
import { generateCookieUsingJwt, verifyJwt } from '@/utils';

interface SessionMiddleware {
  Variables: {
    user: {
      id: string;
      email: string;
      name: string;
    };
  };
}
export const cookieMiddleware = createMiddleware<SessionMiddleware>(
  async (ctx, next) => {
    const cookie = getCookie(ctx, AUTH_COOKIE_NAME);
    if (!cookie) {
      throw new HTTPException(401, {
        message: 'Cookie not found',
      });
    }
    let payload;
    try {
      payload = await verifyJwt(cookie);
    } catch (e: any) {
      throw new HTTPException(400, {
        message: e.message,
      });
    }
    const user = await getUser(payload['sub'] as string);
    if (!user) {
      throw new HTTPException(404, {
        message: 'User not found',
      });
    }
    ctx.set('user', user);
    const newCookie = await generateCookieUsingJwt(user.id);
    setCookie(ctx, AUTH_COOKIE_NAME, newCookie, {
      path: '/',
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: SESSION_TIMEOUT,
      expires: addSeconds(new Date(), SESSION_TIMEOUT),
    });
    await next();
  },
);
