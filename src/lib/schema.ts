import { pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

// to create a table!

// export const testTable = pgTable('test_table', {
//   id: serial('id').primaryKey(),
//   name: text('name').notNull(),
//   createdAt: timestamp('created_at').defaultNow(),
// });