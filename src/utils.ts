import { sign, verify } from 'hono/jwt';
import { SESSION_TIMEOUT, JWT_SECRET_KEY } from '@/config';

export const generateCookieUsingJwt = (sub: string) => {
  return sign(
    {
      sub,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + SESSION_TIMEOUT,
    },
    JWT_SECRET_KEY,
    'HS256',
  );
};

export const verifyJwt = (value: string) => {
  return verify(value, JWT_SECRET_KEY, 'HS256');
};

export function calculateTotalPages(total: number, limit: number) {
  if (limit <= 0) {
    return 1;
  }
  return Math.ceil(total / limit);
}
