import { integer, sqliteTable, text } from "@deco/workers-runtime/drizzle";

// Tabela existente de todos (mantida para compatibilidade)
export const todosTable = sqliteTable("todos", {
  id: integer("id").primaryKey(),
  title: text("title"),
  completed: integer("completed").default(0),
});

// Nova tabela para profile cards
export const profileCardsTable = sqliteTable("profile_cards", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  bio: text("bio").notNull(),
  skills: text("skills").notNull(), // JSON string
  profileImage: text("profile_image"),
  theme: text("theme").notNull().default("blue"),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});
