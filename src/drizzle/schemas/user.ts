import { createId } from '@paralleldrive/cuid2';
import { pgTable, timestamp, varchar } from 'drizzle-orm/pg-core';

export const tUsers = pgTable('users', {
  id: varchar({
    length: 128,
  })
    .$defaultFn(() => createId())
    .primaryKey(),
  name: varchar({
    length: 100,
  }).notNull(),
  email: varchar({
    length: 100,
  })
    .notNull()
    .unique('users.email.uq'),
  password: varchar({
    length: 255,
  }).notNull(),
  created_at: timestamp({ withTimezone: false }).notNull().defaultNow(),
  modified_at: timestamp({ withTimezone: false }),
});
