import { createId } from '@paralleldrive/cuid2';
import { pgTable, timestamp, varchar } from 'drizzle-orm/pg-core';

export const tMembers = pgTable('members', {
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
    .unique('members.email.uq'),
  base_role: varchar({
    length: 10,
  }).notNull(),
  created_at: timestamp({ withTimezone: false }).notNull().defaultNow(),
  modified_at: timestamp({ withTimezone: false }),
  deleted_at: timestamp({ withTimezone: false }),
});
