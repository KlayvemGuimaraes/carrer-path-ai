import { createTool } from "@deco/workers-runtime/mastra";
import { z } from "zod";
import { getDb } from "../db.ts";
import { profileCardsTable } from "../db-schema.ts";
import { eq } from "drizzle-orm";
import type { Env } from "../deco.gen.ts";

// Schema para o card de perfil
export const ProfileCardSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Nome é obrigatório").max(100),
  bio: z.string().max(200, "Bio deve ter no máximo 200 caracteres"),
  skills: z.array(z.string()).min(1, "Pelo menos uma skill é obrigatória").max(10),
  profileImage: z.string().url().optional(),
  theme: z.enum(["blue", "purple", "green", "orange", "pink"]).default("blue"),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export const CreateProfileCardSchema = ProfileCardSchema.omit({ 
  id: true, 
  createdAt: true, 
  updatedAt: true 
});

export const UpdateProfileCardSchema = ProfileCardSchema.partial().omit({ 
  id: true, 
  createdAt: true, 
  updatedAt: true 
});

// Tool para criar um novo card de perfil
export const createProfileCardTool = (env: Env) =>
  createTool({
    id: "CREATE_PROFILE_CARD",
    description: "Cria um novo card de perfil compartilhável",
    inputSchema: CreateProfileCardSchema,
    outputSchema: z.object({
      success: z.boolean(),
      card: ProfileCardSchema,
      shareUrl: z.string().url(),
    }),
    execute: async ({ context }) => {
      try {
        const db = await getDb(env);
        
        // Gerar ID único para o card
        const cardId = crypto.randomUUID();
        const now = new Date().toISOString();
        
        // Inserir no banco de dados
        const newCard = await db.insert(profileCardsTable).values({
          id: cardId,
          name: context.name,
          bio: context.bio,
          skills: JSON.stringify(context.skills),
          profileImage: context.profileImage || null,
          theme: context.theme,
          createdAt: now,
          updatedAt: now,
        }).returning();

        const card = {
          ...newCard[0],
          skills: JSON.parse(newCard[0].skills),
        };

        // Gerar URL compartilhável
        const shareUrl = `${env.DECO_CHAT_WORKSPACE_API?.BASE_URL || 'https://carrerpath-app-2024.deco.page'}/profile/${cardId}`;

        return {
          success: true,
          card,
          shareUrl,
        };
      } catch (error) {
        console.error("Erro ao criar card de perfil:", error);
        throw new Error("Falha ao criar card de perfil");
      }
    },
  });

// Tool para buscar um card de perfil por ID
export const getProfileCardTool = (env: Env) =>
  createTool({
    id: "GET_PROFILE_CARD",
    description: "Busca um card de perfil por ID",
    inputSchema: z.object({
      id: z.string(),
    }),
    outputSchema: z.object({
      success: z.boolean(),
      card: ProfileCardSchema.optional(),
      error: z.string().optional(),
    }),
    execute: async ({ context }) => {
      try {
        const db = await getDb(env);
        
        const result = await db.select().from(profileCardsTable)
          .where(eq(profileCardsTable.id, context.id))
          .limit(1);

        if (result.length === 0) {
          return {
            success: false,
            error: "Card de perfil não encontrado",
          };
        }

        const card = {
          ...result[0],
          skills: JSON.parse(result[0].skills),
        };

        return {
          success: true,
          card,
        };
      } catch (error) {
        console.error("Erro ao buscar card de perfil:", error);
        return {
          success: false,
          error: "Falha ao buscar card de perfil",
        };
      }
    },
  });

// Tool para atualizar um card de perfil
export const updateProfileCardTool = (env: Env) =>
  createTool({
    id: "UPDATE_PROFILE_CARD",
    description: "Atualiza um card de perfil existente",
    inputSchema: z.object({
      id: z.string(),
      updates: UpdateProfileCardSchema,
    }),
    outputSchema: z.object({
      success: z.boolean(),
      card: ProfileCardSchema.optional(),
      error: z.string().optional(),
    }),
    execute: async ({ context }) => {
      try {
        const db = await getDb(env);
        
        // Verificar se o card existe
        const existing = await db.select().from(profileCardsTable)
          .where(eq(profileCardsTable.id, context.id))
          .limit(1);

        if (existing.length === 0) {
          return {
            success: false,
            error: "Card de perfil não encontrado",
          };
        }

        // Preparar dados para atualização
        const updateData: any = {
          updatedAt: new Date().toISOString(),
        };

        if (context.updates.name) updateData.name = context.updates.name;
        if (context.updates.bio) updateData.bio = context.updates.bio;
        if (context.updates.skills) updateData.skills = JSON.stringify(context.updates.skills);
        if (context.updates.profileImage) updateData.profileImage = context.updates.profileImage;
        if (context.updates.theme) updateData.theme = context.updates.theme;

        // Atualizar no banco de dados
        const updated = await db.update(profileCardsTable)
          .set(updateData)
          .where(eq(profileCardsTable.id, context.id))
          .returning();

        const card = {
          ...updated[0],
          skills: JSON.parse(updated[0].skills),
        };

        return {
          success: true,
          card,
        };
      } catch (error) {
        console.error("Erro ao atualizar card de perfil:", error);
        return {
          success: false,
          error: "Falha ao atualizar card de perfil",
        };
      }
    },
  });

// Tool para deletar um card de perfil
export const deleteProfileCardTool = (env: Env) =>
  createTool({
    id: "DELETE_PROFILE_CARD",
    description: "Deleta um card de perfil",
    inputSchema: z.object({
      id: z.string(),
    }),
    outputSchema: z.object({
      success: z.boolean(),
      error: z.string().optional(),
    }),
    execute: async ({ context }) => {
      try {
        const db = await getDb(env);
        
        // Verificar se o card existe
        const existing = await db.select().from(profileCardsTable)
          .where(eq(profileCardsTable.id, context.id))
          .limit(1);

        if (existing.length === 0) {
          return {
            success: false,
            error: "Card de perfil não encontrado",
          };
        }

        // Deletar do banco de dados
        await db.delete(profileCardsTable)
          .where(eq(profileCardsTable.id, context.id));

        return {
          success: true,
        };
      } catch (error) {
        console.error("Erro ao deletar card de perfil:", error);
        return {
          success: false,
          error: "Falha ao deletar card de perfil",
        };
      }
    },
  });

// Tool para listar todos os cards de perfil
export const listProfileCardsTool = (env: Env) =>
  createTool({
    id: "LIST_PROFILE_CARDS",
    description: "Lista todos os cards de perfil",
    inputSchema: z.object({
      limit: z.number().min(1).max(100).default(20),
      offset: z.number().min(0).default(0),
    }),
    outputSchema: z.object({
      success: z.boolean(),
      cards: z.array(ProfileCardSchema),
      total: z.number(),
      error: z.string().optional(),
    }),
    execute: async ({ context }) => {
      try {
        const db = await getDb(env);
        
        const results = await db.select().from(profileCardsTable)
          .limit(context.limit)
          .offset(context.offset)
          .orderBy(profileCardsTable.createdAt);

        const cards = results.map(card => ({
          ...card,
          skills: JSON.parse(card.skills),
        }));

        // Contar total de cards
        const totalResult = await db.select({ count: profileCardsTable.id }).from(profileCardsTable);
        const total = totalResult.length;

        return {
          success: true,
          cards,
          total,
        };
      } catch (error) {
        console.error("Erro ao listar cards de perfil:", error);
        return {
          success: false,
          cards: [],
          total: 0,
          error: "Falha ao listar cards de perfil",
        };
      }
    },
  });
