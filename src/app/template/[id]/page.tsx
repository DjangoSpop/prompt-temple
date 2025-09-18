"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm, type UseFormRegister } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  useV2TemplatesRetrieveQuery,
  useV2TemplatesStartUsageCreateMutation,
  useV2TemplatesCompleteUsageCreateMutation,
  useV2TemplatesRateTemplateCreateMutation,
} from "@/hooks/api";
import { useI18nStore } from "@/store/i18nStore";
import {
  createDefaultValues,
  createTemplateSchema,
  formatPercent,
  renderTemplateContent,
  ratingScale,
} from "@/lib/templates/form-utils";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  AlertCircle,
  ArrowLeft,
  Copy,
  Loader2,
  Sparkles,
  Star,
} from "lucide-react";

import type { components } from "@/types/api";

const ratingOptions = ratingScale;

type PromptField = components["schemas"]["PromptField"];
type TemplateUsageBody = NonNullable<components["schemas"]["TemplateUsageData"]>;
type FieldInputProps = {
  field: PromptField;
  register: UseFormRegister<Record<string, unknown>>;
  error?: string;
};

type TemplateFormSchema = ReturnType<typeof createTemplateSchema>;
type FormValues = z.infer<TemplateFormSchema>;

export default function TemplateDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { t, direction } = useI18nStore();
  const templateId = params?.id;

  const templateQuery = useV2TemplatesRetrieveQuery(
    templateId ? { pathParams: { id: templateId } } : undefined,
    {
      enabled: Boolean(templateId),
      onError: (error) => toast.error(error?.message ?? t("common.error")),
    }
  );

  const template = templateQuery.data;
  const schema = useMemo<TemplateFormSchema>(() => createTemplateSchema(template?.fields ?? [], t), [template?.fields, t]);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: useMemo(() => createDefaultValues(template?.fields ?? []) as FormValues, [template?.fields]),
    mode: "onBlur",
  });

  useEffect(() => {
    if (template) {
      form.reset(createDefaultValues(template.fields ?? []) as FormValues);
    }
  }, [template, form]);

  const startUsage = useV2TemplatesStartUsageCreateMutation({
    onError: (error) => toast.error(error?.message ?? t("common.error")),
  });
  const completeUsage = useV2TemplatesCompleteUsageCreateMutation({
    onError: (error) => toast.error(error?.message ?? t("common.error")),
    onSuccess: () => toast.success(t("templateDetail.runSuccess")),
  });
  const rateTemplate = useV2TemplatesRateTemplateCreateMutation({
    onError: (error) => toast.error(error?.message ?? t("common.error")),
    onSuccess: () => toast.success(t("templateDetail.ratingSuccess")),
  });

  const watchValues = form.watch();
  const renderedPrompt = useMemo(
    () => renderTemplateContent(template?.template_content, template?.fields ?? [], watchValues ?? {}),
    [template?.template_content, template?.fields, watchValues]
  );

  const [rating, setRating] = useState<number | null>(null);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(renderedPrompt);
      toast.success(t("templateDetail.copySuccess"));
    } catch {
      toast.error(t("templateDetail.copyError"));
    }
  };

  const onSubmit = form.handleSubmit(async (values) => {
    if (!templateId) return;
    const payload: TemplateUsageBody = {
      variables: values,
      output: renderedPrompt,
      success: true,
    };

    const startResult = await startUsage.mutateAsync({ pathParams: { id: templateId } });
    await completeUsage.mutateAsync({
      pathParams: { id: templateId },
      body: {
        ...payload,
        usage_session_id: (startResult as Record<string, unknown>)?.usage_session_id as string | undefined,
      } as TemplateUsageBody & { usage_session_id?: string },
    });
  });

  const handleRating = async (score: number) => {
    if (!templateId) return;
    setRating(score);
    await rateTemplate.mutateAsync({
      pathParams: { id: templateId },
      body: { rating: score },
    });
  };

  return (
    <main className="space-y-6" dir={direction}>
      <div>
        <Button variant="ghost" size="sm" className="mb-2 gap-2" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
          {t("common.back")}
        </Button>
        <Card className="border-none bg-background/60 backdrop-blur">
          {templateQuery.isLoading ? (
            <TemplateSkeleton />
          ) : templateQuery.isError ? (
            <Alert variant="destructive" role="alert" className="m-6">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>{t("common.error")}</AlertTitle>
              <AlertDescription>
                {templateQuery.error?.message ?? t("templateDetail.loadError")}
              </AlertDescription>
            </Alert>
          ) : template ? (
            <CardContent className="grid gap-6 lg:grid-cols-[2fr,1fr]">
              <section className="space-y-4">
                <header className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="secondary">{template.category?.name}</Badge>
                    {template.is_ai_generated && (
                      <Badge variant="outline" className="gap-1">
                        <Sparkles className="h-3 w-3" />
                        {t("templateDetail.aiGenerated")}
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-3xl font-semibold">
                    {template.title}
                  </CardTitle>
                  <CardDescription>{template.description}</CardDescription>
                </header>

                <Tabs defaultValue="form" className="space-y-4">
                  <TabsList>
                    <TabsTrigger value="form">{t("templateDetail.variablesTab")}</TabsTrigger>
                    <TabsTrigger value="preview">{t("templateDetail.previewTab")}</TabsTrigger>
                  </TabsList>
                  <TabsContent value="form" className="space-y-4">
                    <form onSubmit={onSubmit} className="space-y-6" noValidate>
                      <div className="space-y-4">
                        {(template.fields ?? []).map((field) => (
                          <FieldInput
                            key={field.id}
                            field={field}
                            register={form.register as UseFormRegister<Record<string, unknown>>}
                            error={form.formState.errors?.[field.id]?.message as string | undefined}
                          />
                        ))}
                        {template.fields?.length === 0 && (
                          <p className="text-sm text-muted-foreground">
                            {t("templateDetail.noVariables")}
                          </p>
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-3">
                        <Button type="submit" disabled={startUsage.isPending || completeUsage.isPending} className="gap-2">
                          {(startUsage.isPending || completeUsage.isPending) && (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          )}
                          {t("templateDetail.runTemplate")}
                        </Button>
                        <Button type="button" variant="outline" onClick={() => form.reset()}>
                          {t("templateDetail.resetForm")}
                        </Button>
                      </div>
                    </form>
                  </TabsContent>
                  <TabsContent value="preview">
                    <Card className="border bg-muted/40">
                      <CardHeader>
                        <CardTitle className="text-sm font-medium">
                          {t("templateDetail.previewTitle")}
                        </CardTitle>
                        <CardDescription>
                          {t("templateDetail.previewDescription")}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <ScrollArea className="max-h-[320px] rounded border bg-background p-4">
                          <pre className="whitespace-pre-wrap text-sm leading-relaxed text-foreground">
                            {renderedPrompt || t("templateDetail.previewPlaceholder")}
                          </pre>
                        </ScrollArea>
                        <div className="flex justify-end">
                          <Button type="button" variant="outline" className="gap-2" onClick={handleCopy}>
                            <Copy className="h-4 w-4" />
                            {t("templateDetail.copyPrompt")}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </section>

              <aside className="space-y-4">
                <Card className="border bg-muted/40">
                  <CardHeader>
                    <CardTitle className="text-base font-semibold">
                      {t("templateDetail.metaTitle")}
                    </CardTitle>
                    <CardDescription>{t("templateDetail.metaSubtitle")}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">{t("templateDetail.author")}</span>
                      <span>{template.author?.username ?? template.author?.email ?? t("templateDetail.unknown")}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">{t("templateDetail.usageCount")}</span>
                      <span>{template.usage_count ?? 0}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">{t("templateDetail.completionRate")}</span>
                      <span>{formatPercent(template.completion_rate)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">{t("templateDetail.averageRating")}</span>
                      <span className="inline-flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-500" />
                        {template.average_rating?.toFixed(1) ?? "—"}
                      </span>
                    </div>
                    <Separator />
                    <div className="space-y-2">
                      <p className="text-sm font-medium">{t("templateDetail.ratePrompt")}</p>
                      <div className="flex items-center gap-2">
                        {ratingOptions.map((value) => (
                          <Button
                            key={value}
                            type="button"
                            size="sm"
                            variant={rating === value ? "default" : "outline"}
                            onClick={() => handleRating(value)}
                            disabled={rateTemplate.isPending}
                          >
                            {value}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
                {template.tags && Array.isArray(template.tags) && template.tags.length > 0 && (
                  <Card className="border bg-muted/40">
                    <CardHeader>
                      <CardTitle className="text-base font-semibold">
                        {t("templateDetail.tagsTitle")}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-wrap gap-2">
                      {template.tags.map((tag: string) => (
                        <Badge key={tag} variant="outline">{tag}</Badge>
                      ))}
                    </CardContent>
                  </Card>
                )}
              </aside>
            </CardContent>
          ) : null}
        </Card>
      </div>
    </main>
  );
}

function FieldInput({ field, register, error }: FieldInputProps) {
  const inputId = `field-${field.id}`;
  const baseProps = {
    id: inputId,
    placeholder: field.placeholder,
    ...register(field.id),
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label htmlFor={inputId} className="text-sm font-medium">
          {field.label}
          {field.is_required && <span className="ml-1 text-destructive">*</span>}
        </Label>
        {field.help_text && (
          <span className="text-xs text-muted-foreground">{field.help_text}</span>
        )}
      </div>
      {renderFieldInput(field, baseProps)}
      {error && (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

function renderFieldInput(field: PromptField, props: Record<string, unknown>) {
  switch (field.field_type) {
    case "textarea":
      return <Textarea minRows={4} className="w-full" {...props} />;
    case "number":
      return <Input type="number" inputMode="decimal" {...props} />;
    default:
      return <Input {...props} />;
  }
}

type SkeletonProps = Record<string, never>;

function TemplateSkeleton(_: SkeletonProps) {
  return (
    <CardContent className="space-y-6">
      <div className="space-y-3">
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-8 w-2/3" />
        <Skeleton className="h-4 w-1/2" />
      </div>
      <div className="grid gap-4 lg:grid-cols-[2fr,1fr]">
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-16 w-full" />
          ))}
        </div>
        <div className="space-y-4">
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      </div>
    </CardContent>
  );
}
