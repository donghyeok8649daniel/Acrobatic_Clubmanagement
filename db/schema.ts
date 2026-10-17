import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
export const teams = sqliteTable("teams", { id: text("id").primaryKey(), state: text("state").notNull(), version: integer("version").notNull().default(0) });
export const credentials = sqliteTable("credentials", { id: text("id").primaryKey(), team: text("team").notNull(), member: text("member").notNull(), hash: text("hash").notNull() });
export const sessions = sqliteTable("sessions", { hash: text("hash").primaryKey(), team: text("team").notNull(), member: text("member").notNull(), expires: integer("expires").notNull() });
export const limits = sqliteTable("limits", { id: text("id").primaryKey(), count: integer("count").notNull(), expires: integer("expires").notNull() });
