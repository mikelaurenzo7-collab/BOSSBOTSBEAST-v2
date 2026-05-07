// Enhanced schema for secure OAuth Integration Beasts

export const beastConnections = pgTable('beast_connections', {
  id: serial('id').primaryKey(),
  userId: varchar('user_id', { length: 255 }).notNull(),
  beastType: varchar('beast_type', { length: 100 }).notNull(), // e.g. 'MetaBeast', 'InstagramBeast'
  provider: varchar('provider', { length: 100 }).notNull(),
  
  // OAuth Tokens (encrypted at rest)
  accessToken: text('access_token').notNull(),
  refreshToken: text('refresh_token'),
  expiresAt: timestamp('expires_at'),
  
  // Metadata
  scopes: text('scopes').array(),
  accountId: varchar('account_id', { length: 255 }), // e.g. Instagram Business ID, Facebook Page ID
  accountName: varchar('account_name', { length: 255 }),
  
  isActive: boolean('is_active').default(true),
  lastUsedAt: timestamp('last_used_at').defaultNow(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (table) => {
  return {
    userBeastIdx: uniqueIndex('user_beast_idx').on(table.userId, table.beastType),
  };
});

// Add to existing schema export if needed
export { beastConnections };
