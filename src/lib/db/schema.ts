import { relations } from "drizzle-orm";
import {
  index,
  jsonb,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

// Relative import (not the `@/` alias): drizzle-kit loads this file through
// esbuild, which does not resolve TS path aliases.
import {
  PLATFORMS,
  type UnifiedContentModel,
} from "../content/unified-content-model";

/**
 * Drizzle schema for Curator.
 *
 * Polymorphism is modelled with a single `saved_items` table whose normalized
 * payload lives in the `content` JSONB column, typed as the discriminated
 * `UnifiedContentModel`. The `platform` discriminator is also promoted to its
 * own indexed enum column for fast filtering without touching the JSON.
 */

/* -------------------------------------------------------------------------- */
/*                                   Enums                                     */
/* -------------------------------------------------------------------------- */

/** Platforms Curator can ingest — shares its values with the content model. */
export const platformEnum = pgEnum("platform", PLATFORMS);

/** Lifecycle of an ingested item as it moves through the queue. */
export const itemStatusEnum = pgEnum("item_status", [
  "pending",
  "processing",
  "ready",
  "failed",
]);

/* -------------------------------------------------------------------------- */
/*                              Shared columns                                 */
/* -------------------------------------------------------------------------- */

const timestamps = {
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
};

/* -------------------------------------------------------------------------- */
/*                                   Tables                                    */
/* -------------------------------------------------------------------------- */

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name"),
  imageUrl: text("image_url"),
  ...timestamps,
});

export const folders = pgTable(
  "folders",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    slug: text("slug").notNull(),
    /** Optional accent color (hex) for subtle UI differentiation. */
    color: text("color"),
    ...timestamps,
  },
  (table) => [
    uniqueIndex("folders_user_id_slug_key").on(table.userId, table.slug),
  ],
);

export const tags = pgTable(
  "tags",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    slug: text("slug").notNull(),
    color: text("color"),
    ...timestamps,
  },
  (table) => [
    uniqueIndex("tags_user_id_slug_key").on(table.userId, table.slug),
  ],
);

export const savedItems = pgTable(
  "saved_items",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    /** A saved item lives in at most one folder. */
    folderId: uuid("folder_id").references(() => folders.id, {
      onDelete: "set null",
    }),

    /** The raw URL the user saved. */
    url: text("url").notNull(),
    /** Detected platform — `null` until the worker classifies the URL. */
    platform: platformEnum("platform"),
    status: itemStatusEnum("status").notNull().default("pending"),

    /** Denormalized title for fast lists/search before the card is opened. */
    title: text("title"),
    /** The normalized payload. `null` until ingestion completes. */
    content: jsonb("content").$type<UnifiedContentModel>(),
    /** Original API response, kept for debugging and re-normalization. */
    rawPayload: jsonb("raw_payload"),
    /** Last failure reason when `status = 'failed'`. */
    error: text("error"),

    savedAt: timestamp("saved_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    processedAt: timestamp("processed_at", { withTimezone: true }),
    ...timestamps,
  },
  (table) => [
    index("saved_items_user_id_idx").on(table.userId),
    index("saved_items_status_idx").on(table.status),
    index("saved_items_folder_id_idx").on(table.folderId),
    index("saved_items_user_id_saved_at_idx").on(table.userId, table.savedAt),
  ],
);

/** Many-to-many join between saved items and tags. */
export const savedItemTags = pgTable(
  "saved_item_tags",
  {
    savedItemId: uuid("saved_item_id")
      .notNull()
      .references(() => savedItems.id, { onDelete: "cascade" }),
    tagId: uuid("tag_id")
      .notNull()
      .references(() => tags.id, { onDelete: "cascade" }),
  },
  (table) => [
    primaryKey({ columns: [table.savedItemId, table.tagId] }),
    index("saved_item_tags_tag_id_idx").on(table.tagId),
  ],
);

/* -------------------------------------------------------------------------- */
/*                                 Relations                                   */
/* -------------------------------------------------------------------------- */

export const usersRelations = relations(users, ({ many }) => ({
  folders: many(folders),
  tags: many(tags),
  savedItems: many(savedItems),
}));

export const foldersRelations = relations(folders, ({ one, many }) => ({
  user: one(users, { fields: [folders.userId], references: [users.id] }),
  savedItems: many(savedItems),
}));

export const tagsRelations = relations(tags, ({ one, many }) => ({
  user: one(users, { fields: [tags.userId], references: [users.id] }),
  savedItemTags: many(savedItemTags),
}));

export const savedItemsRelations = relations(savedItems, ({ one, many }) => ({
  user: one(users, { fields: [savedItems.userId], references: [users.id] }),
  folder: one(folders, {
    fields: [savedItems.folderId],
    references: [folders.id],
  }),
  savedItemTags: many(savedItemTags),
}));

export const savedItemTagsRelations = relations(savedItemTags, ({ one }) => ({
  savedItem: one(savedItems, {
    fields: [savedItemTags.savedItemId],
    references: [savedItems.id],
  }),
  tag: one(tags, { fields: [savedItemTags.tagId], references: [tags.id] }),
}));

/* -------------------------------------------------------------------------- */
/*                              Inferred types                                 */
/* -------------------------------------------------------------------------- */

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type Folder = typeof folders.$inferSelect;
export type NewFolder = typeof folders.$inferInsert;

export type Tag = typeof tags.$inferSelect;
export type NewTag = typeof tags.$inferInsert;

export type SavedItem = typeof savedItems.$inferSelect;
export type NewSavedItem = typeof savedItems.$inferInsert;

export type SavedItemTag = typeof savedItemTags.$inferSelect;
export type NewSavedItemTag = typeof savedItemTags.$inferInsert;
