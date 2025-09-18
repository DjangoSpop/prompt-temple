import { z } from "zod";
import type { components } from "@/types/api";

export const ratingScale = [1, 2, 3, 4, 5] as const;

type PromptField = components["schemas"]["PromptField"];

type Translator = (key: string, params?: Record<string, string | number>) => string;

export const createTemplateSchema = (fields: PromptField[], t: Translator) => {
  const shape: Record<string, z.ZodTypeAny> = {};
  fields.forEach((field) => {
    const label = field.label || t("templateDetail.unnamedField");
    const base = field.field_type === "number"
      ? z.coerce
          .number({ invalid_type_error: t("templateDetail.numberRequired", { field: label }) })
          .refine((value) => !Number.isNaN(value), t("templateDetail.numberRequired", { field: label }))
      : z.string();
    shape[field.id] = field.is_required
      ? base.min(1, t("templateDetail.requiredField", { field: label }))
      : base.optional();
  });
  return z.object(shape);
};

export const createDefaultValues = (fields: PromptField[]) =>
  fields.reduce<Record<string, unknown>>((acc, field) => {
    acc[field.id] = field.default_value ?? "";
    return acc;
  }, {});

export const renderTemplateContent = (
  content: string | undefined,
  fields: PromptField[] = [],
  values: Record<string, unknown> = {}
) => {
  if (!content) return "";
  return Object.entries(values).reduce((acc, [key, raw]) => {
    const currentField = fields.find((field) => field.id === key);
    const label = currentField?.label ?? key;
    const safeValue = raw === undefined || raw === null ? "" : String(raw);
    const pattern = new RegExp(`{{\\s*${escapeRegExp(label)}\\s*}}`, "gi");
    return acc.replace(pattern, safeValue);
  }, content);
};

export const formatPercent = (value?: number) => {
  if (value === undefined || value === null) return "—";
  return `${Math.round(value * 100)}%`;
};

const escapeRegExp = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
