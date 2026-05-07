// Enhanced schema for secure OAuth Integration Beasts + Swarm workflows

import { pgTable, serial, varchar, text, timestamp, boolean, jsonb, uniqueIndex } from 'drizzle-orm/pg-core';

export const beastConnections = pgTable('beast_connections', {
  id: serial('id').primaryKey(),
  userId: varchar('user_id', { length: 255 }).notNull(),
  beastType: varchar('beast_type', { length: 100 }).notNull(),
  provider: varchar('provider', { length: 100 }).notNull(),
  
  // OAuth Tokens (encrypted at rest)
  accessToken: text('access_token').notNull(),
  refreshToken: text('refresh_token'),
  expiresAt: timestamp('expires_at'),
  
  // Metadata
  scopes: text('scopes').array(),
  accountId: varchar('account_id', { length: 255 }),
  accountName: varchar('account_name', { length: 255 }),
  
  isActive: boolean('is_active').default(true),
  lastUsedAt: timestamp('last_used_at').defaultNow(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (table) => ({
  userBeastIdx: uniqueIndex('user_beast_idx').on(table.userId, table.beastType),
}));

// Activity logs for all beast executions and swarm workflows
export const activityLogs = pgTable('activity_logs', {
  id: serial('id').primaryKey(),
  userId: varchar('user_id', { length: 255 }).notNull(),
  workflowId: varchar('workflow_id', { length: 255 }), // optional link to swarm workflow
  beastType: varchar('beast_type', { length: 100 }).notNull(),
  action: varchar('action', { length: 100 }).notNull(), // e.g. 'create_issue', 'send_message', 'post_comment'
  status: varchar('status', { length: 20 }).notNull(), // 'success', 'failed', 'pending'
  input: jsonb('input'), // the payload sent to the beast
  output: jsonb('output'), // response or error
  executedAt: timestamp('executed_at').defaultNow(),
  durationMs: serial('duration_ms'),
});

// Simple workflow definitions for Swarm Commander
export const workflows = pgTable('workflows', {
  id: serial('id').primaryKey(),
  userId: varchar('user_id', { length: 255 }).notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  trigger: jsonb('trigger'), // { beast: 'LinearBot', event: 'issue_created' }
  steps: jsonb('steps'), // array of { beast: 'SlackBot', action: 'send_message', params: {...} }
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export { beastConnections, activityLogs, workflows };
