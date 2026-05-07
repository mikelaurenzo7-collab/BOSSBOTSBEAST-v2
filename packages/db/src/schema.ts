// ... existing tables ...

export const botSettings = pgTable('bot_settings', {
  id: serial('id').primaryKey(),
  userId: varchar('user_id', { length: 255 }).notNull(),
  beastType: varchar('beast_type', { length: 100 }).notNull(),
  autonomyLevel: integer('autonomy_level').default(70), // 0-100
  permissions: jsonb('permissions').default({ read: true, write: true, delete: false, notify: true }),
  customInstructions: text('custom_instructions'),
  memoryRetentionDays: integer('memory_retention_days').default(30),
  dailyExecutionCap: integer('daily_execution_cap').default(100),
  notifyOnFailure: boolean('notify_on_failure').default(true),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (table) => ({
  userBeastIdx: uniqueIndex('user_beast_settings_idx').on(table.userId, table.beastType),
}));

export { beastConnections, activityLogs, workflows, botSettings };
