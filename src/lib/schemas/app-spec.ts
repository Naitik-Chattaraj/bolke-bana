import { z } from "zod";

export const UIComponentSchema = z.object({
  id: z.string(),
  type: z.enum([
    "heading", "paragraph", "button", "input", "textarea", "select", 
    "checkbox", "radio", "card", "table", "badge", "alert", "modal", 
    "tabs", "navbar", "sidebar", "list", "avatar", "image", "chart", 
    "stat", "form", "login", "dashboard", "empty-state"
  ]),
  props: z.record(z.string(), z.any()).default({}),
  dataSource: z.string().nullable().default(null),
  actions: z.array(z.string()).default([]),
});

export const PageSchema = z.object({
  id: z.string(),
  name: z.string(),
  purpose: z.string(),
  components: z.array(UIComponentSchema).default([]),
});

export const EntitySchema = z.object({
  name: z.string(),
  fields: z.array(
    z.object({
      name: z.string(),
      type: z.string(),
      required: z.boolean().default(true),
    })
  ).default([]),
});

export const FeatureSchema = z.object({
  name: z.string(),
  description: z.string(),
});

export const AppSpecSchema = z.object({
  project: z.object({
    name: z.string(),
    description: z.string(),
    targetUsers: z.array(z.string()).default([]),
    problem: z.string().default(""),
  }),
  features: z.array(FeatureSchema).default([]),
  pages: z.array(PageSchema).default([]),
  entities: z.array(EntitySchema).default([]),
  navigation: z.array(
    z.object({
      label: z.string(),
      pageId: z.string(),
    })
  ).default([]),
  theme: z.record(z.string(), z.any()).default({}),
});

export type AppSpec = z.infer<typeof AppSpecSchema>;
export type UIComponent = z.infer<typeof UIComponentSchema>;
export type Page = z.infer<typeof PageSchema>;
export type Entity = z.infer<typeof EntitySchema>;
export type Feature = z.infer<typeof FeatureSchema>;
