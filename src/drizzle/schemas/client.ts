import { createId } from '@paralleldrive/cuid2';
import { pgTable, timestamp, varchar } from 'drizzle-orm/pg-core';

export const tClients = pgTable('clients', {
  id: varchar({
    length: 128,
  })
    .$defaultFn(() => createId())
    .primaryKey(),
  name: varchar({
    length: 100,
  }).notNull(),
  address: varchar(),
  email: varchar({
    length: 100,
  }),
  website: varchar({
    length: 100,
  }),
  phone_number: varchar({
    length: 20,
  }),
  fax_number: varchar({
    length: 20,
  }),
  created_at: timestamp({ withTimezone: false }).notNull().defaultNow(),
  modified_at: timestamp({ withTimezone: false }),
});
