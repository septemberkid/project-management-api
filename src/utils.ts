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

export function getSortedFields<T extends readonly string[]>(
  sortBy: string | undefined,
  allowedFields: T,
  defaultField: T[number],
  sortDir: 'asc' | 'desc' | string,
) {
  let sortedField: string | undefined = sortBy;
  if (typeof sortedField == 'undefined') {
    sortedField = defaultField;
  }
  if (sortedField && !allowedFields.includes(sortedField)) {
    sortedField = defaultField;
  }
  if (sortDir !== 'asc' && sortDir !== 'desc') {
    sortDir = 'asc';
  }
  return {
    sortField: sortedField,
    sortDir: sortDir,
  };
}
