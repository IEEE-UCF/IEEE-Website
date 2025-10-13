import { pgTable, serial, varchar, text, timestamp, integer } from 'drizzle-orm/pg-core';

// to create a table!

// export const testTable = pgTable('test_table', {
//   id: serial('id').primaryKey(),
//   name: text('name').notNull(),
//   createdAt: timestamp('created_at').defaultNow(),
// });

export const events = pgTable('events', {
  id: serial('id').primaryKey(),
  eventId: varchar('event_id', { length: 50 }).notNull().unique(), 
  title: varchar('title', { length: 255 }).notNull(),
  location: varchar('location', { length: 255 }).notNull(),
  committeeId: integer('committee_id'),
  time: timestamp('time', { withTimezone: true }).notNull(),
  description: text('description').notNull(),
  flyerUrl: varchar('flyer_url', { length: 500 }),
  rsvpLink: varchar('rsvp_link', { length: 500 }),
  photoUrls: text('photo_urls').$type<string[]>(),
  timeUpdated: timestamp('time_updated', { withTimezone: true }).defaultNow().notNull(),
  dateCreated: timestamp('date_created', { withTimezone: true }).defaultNow().notNull(),
});

// Type inference for TypeScript
export type Event = typeof events.$inferSelect;
export type NewEvent = typeof events.$inferInsert;