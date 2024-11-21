import { eq } from 'drizzle-orm';
import { dbClient } from '@/drizzle';
import { tUsers } from '@/drizzle/schemas';
import { generateCookieUsingJwt } from '@/utils';
import { HTTPException } from 'hono/http-exception';
import { SignInSchema, SignUpSchema } from '@/features/auth/schema';

export const signUp = async ({ name, email, password }: SignUpSchema) => {
  const exist = (await dbClient.$count(tUsers, eq(tUsers.email, email))) > 0;
  if (exist) {
    throw new HTTPException(400, {
      message: 'User already exists',
    });
  }
  const hashedPassword = await Bun.password.hash(password, 'bcrypt');
  const results = await dbClient
    .insert(tUsers)
    .values({
      name,
      email,
      password: hashedPassword,
      created_at: new Date(),
    })
    .returning({
      id: tUsers.id,
    });
  return generateCookieUsingJwt(results[0].id);
};
export const signIn = async ({ email, password }: SignInSchema) => {
  const user = await dbClient.query.tUsers.findFirst({
    columns: {
      id: true,
      password: true,
      email: true,
    },
    where: (s) => eq(s.email, email),
  });
  if (!user) {
    throw new HTTPException(401, {
      message: 'Invalid credential',
    });
  }
  const verified = await Bun.password.verify(password, user.password);
  if (!verified) {
    throw new HTTPException(401, {
      message: 'Invalid credential',
    });
  }
  return generateCookieUsingJwt(user.id);
};
