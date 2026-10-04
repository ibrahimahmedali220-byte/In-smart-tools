import { pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

// 1. Users table (Linked to Firebase Auth UID)
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(), // Firebase Auth UID
  email: text('email'),
  createdAt: timestamp('created_at').defaultNow(),
});

// 2. Calling Sessions Table (Future masked calling session records)
export const callingSessions = pgTable('calling_sessions', {
  id: serial('id').primaryKey(),
  sessionId: text('session_id').notNull().unique(),
  status: text('status').notNull().default('coming_soon'),
  proxyNumber: text('proxy_number'),
  createdAt: timestamp('created_at').defaultNow(),
});

// 3. Abuse Reports Table
export const abuseReports = pgTable('abuse_reports', {
  id: serial('id').primaryKey(),
  reportType: text('report_type').notNull(),
  details: text('details').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

// 4. Blocked Identifiers Table
export const blockedNumbers = pgTable('blocked_numbers', {
  id: serial('id').primaryKey(),
  numberHash: text('number_hash').notNull(),
  reason: text('reason'),
  createdAt: timestamp('created_at').defaultNow(),
});
