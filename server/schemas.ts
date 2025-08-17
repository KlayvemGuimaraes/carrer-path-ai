import { z } from "zod";

export const CertificationSchema = z.object({
  id: z.string(),
  name: z.string(),
  provider: z.string(),
  area: z.enum(["cloud", "seguranca", "dados", "gestao", "dev", "redes"]).default("dev").optional().or(z.string()),
  level: z.enum(["iniciante", "intermediario", "avancado"]),
  skills: z.array(z.string()).default([]),
  roles: z.array(z.string()).default([]),
  prerequisites: z.array(z.string()).default([]),
  durationHours: z.number().optional(),
  estimatedCostUSD: z.number().optional(),
});
export type Certification = z.infer<typeof CertificationSchema>;

export const UserProfileSchema = z.object({
  role: z.string(),                // "desenvolvedor", "devops", "pm"...
  seniority: z.enum(["junior", "pleno", "senior"]),
  targetArea: z.string().optional(),// "cloud", "seguranca", ...
  goals: z.array(z.string()).default([]), // ex: ["arquitetura", "sair do suporte"]
  budgetUSD: z.number().optional()
});
export type UserProfile = z.infer<typeof UserProfileSchema>;

export const RecommendationItemSchema = z.object({
  certification: CertificationSchema,
  score: z.number(),
  reasons: z.array(z.string()),
});
export type RecommendationItem = z.infer<typeof RecommendationItemSchema>;

export const RecommendationResponseSchema = z.object({
  items: z.array(RecommendationItemSchema),
});
export type RecommendationResponse = z.infer<typeof RecommendationResponseSchema>;

// Schema para Profile Card
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
export type ProfileCard = z.infer<typeof ProfileCardSchema>;

export const CreateProfileCardSchema = ProfileCardSchema.omit({ 
  id: true, 
  createdAt: true, 
  updatedAt: true 
});
export type CreateProfileCard = z.infer<typeof CreateProfileCardSchema>;

export const UpdateProfileCardSchema = ProfileCardSchema.partial().omit({ 
  id: true, 
  createdAt: true, 
  updatedAt: true 
});
export type UpdateProfileCard = z.infer<typeof UpdateProfileCardSchema>;
