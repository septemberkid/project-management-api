import { createId } from '@paralleldrive/cuid2';
import { date, pgTable, timestamp, varchar } from 'drizzle-orm/pg-core';
import { tClients } from '@/drizzle/schemas/client';
import { relations } from 'drizzle-orm';

export const tProjects = pgTable('projects', {
  id: varchar({
    length: 128,
  })
    .$defaultFn(() => createId())
    .primaryKey(),
  name: varchar({
    length: 100,
  }).notNull(),
  description: varchar({
    length: 150,
  }),
  start_date: date(),
  end_date: date(),
  client_id: varchar({
    length: 128,
  })
    .references(() => tClients.id, {
      onUpdate: 'cascade',
      onDelete: 'restrict',
    })
    .notNull(),
  created_at: timestamp({ withTimezone: false }).notNull().defaultNow(),
  modified_at: timestamp({ withTimezone: false }),
});

export const projectRelationToClient = relations(tProjects, ({ one }) => ({
  client: one(tClients, {
    fields: [tProjects.client_id],
    references: [tClients.id],
    relationName: 'projectRelationToClient',
  }),
}));
