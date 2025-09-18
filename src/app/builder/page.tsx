"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm, type UseFormRegister } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  useV2TemplatesListQuery,
  useV2TemplatesRetrieveQuery,
  useV2TemplatesStartUsageCreateMutation,
  useV2TemplatesCompleteUsageCreateMutation,
} from "@/hooks/api";
import { useI18nStore } from "@/store/i18nStore";
import {
  createDefaultValues,
  createTemplateSchema,
  renderTemplateContent,
} from "@/lib/templates/form-utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  AlertCircle,
  Loader2,
  Play,
  RefreshCw,
  Upload,
  Download,
  Copy,
} from "lucide-react";

import type { components } from "@/types/api";

const PAGE_SIZE = 10;

type PromptField = components["schemas"]["PromptField"];
type FieldInputProps = {
  field: PromptField;
  register: UseFormRegister<Record<string, unknown>>;
  error?: string;
};

type BuilderSchema = ReturnType<typeof createTemplateSchema>;
type BuilderValues = z.infer<BuilderSchema>;

export default function BuilderPage() {
  const { t, direction } = useI18nStore();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const templatesQuery = useV2TemplatesListQuery(
    {
      query: {
        search: search || undefined,
        page,
        ordering: "-popularity_score",
      },
    },
    {
      placeholderData: (previous) => previous,
      onError: (error) => toast.error(error?.message ?? t("common.error")),
    }
  );

  const templates = templatesQuery.data?.results ?? [];
  const totalItems = templatesQuery.data?.count ?? templates.length;
  const totalPages = totalItems > 0 ? Math.ceil(totalItems / PAGE_SIZE) : 1;

  const [selectedTemplateId, setSelectedTemplateId] = useState<string | undefined>(() => templates[0]?.id);

  useEffect(() => {
    if (!selectedTemplateId && templates.length) {
      setSelectedTemplateId(templates[0]?.id);
    }
  }, [templates, selectedTemplateId]);

  const templateDetailQuery = useV2TemplatesRetrieveQuery(
    selectedTemplateId ? { pathParams: { id: selectedTemplateId } } : undefined,
    {
      enabled: Boolean(selectedTemplateId),
      onError: (error) => toast.error(error?.message ?? t("common.error")),
    }
  );

  const template = templateDetailQuery.data;
  const schema = useMemo<BuilderSchema>(() => createTemplateSchema(template?.fields ?? [], t), [template?.fields, t]);

  const form = useForm<BuilderValues>({
    resolver: zodResolver(schema),
    defaultValues: useMemo(() => createDefaultValues(template?.fields ?? []) as BuilderValues, [template?.fields]),
  });

  useEffect(() => {
    if (template) {
      form.reset(createDefaultValues(template.fields ?? []) as BuilderValues);
    }
  }, [template, form]);

  const startUsage = useV2TemplatesStartUsageCreateMutation({
    onError: (error) => toast.error(error?.message ?? t("common.error")),
  });
  const completeUsage = useV2TemplatesCompleteUsageCreateMutation({
    onError: (error) => toast.error(error?.message ?? t("common.error")),
    onSuccess: () => toast.success(t("builder.runSuccess")),
  });

  const watchValues = form.watch();
  const renderedPrompt = useMemo(
    () => renderTemplateContent(template?.template_content, template?.fields ?? [], watchValues ?? {}),
    [template?.template_content, template?.fields, watchValues]
  );

  const handleRun = form.handleSubmit(async (values) => {
    if (!selectedTemplateId) return;
    const payload = {
      variables: values,
      output: renderedPrompt,
      success: true,
    } satisfies components["schemas"]["TemplateUsageData"];

    const startResult = await startUsage.mutateAsync({ pathParams: { id: selectedTemplateId } });
    await completeUsage.mutateAsync({
      pathParams: { id: selectedTemplateId },
      body: {
        ...payload,
        usage_session_id: (startResult as Record<string, unknown>)?.usage_session_id as string | undefined,
      },
    });
  });

  const handleExport = (format: "json" | "txt") => {
    const content = format === "json"
      ? JSON.stringify({ prompt: renderedPrompt, variables: watchValues }, null, 2)
      : renderedPrompt;
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = format === "json" ? "prompt.json" : "prompt.txt";
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(renderedPrompt);
      toast.success(t("builder.copySuccess"));
    } catch {
      toast.error(t("builder.copyError"));
    }
  };

  return (
    <main className="space-y-6" dir={direction}>
      <section>
        <Card className="border-none bg-background/60 backdrop-blur" aria-labelledby="builder-heading">
          <CardHeader className="space-y-2">
            <CardTitle id="builder-heading" className="text-3xl font-semibold">
              {t("builder.title")}
            </CardTitle>
            <CardDescription>{t("builder.subtitle")}</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 lg:grid-cols-[320px,1fr]">
            <div className="space-y-3">
              <Label htmlFor="builder-search" className="text-xs font-medium uppercase tracking-wide">
                {t("builder.templatePicker")}
              </Label>
              <Input
                id="builder-search"
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                  setPage(1);
                }}
                placeholder={t("library.searchPlaceholder") ?? ""}
              />
              <div className="rounded-md border">
                {templatesQuery.isLoading ? (
                  <div className="space-y-2 p-4">
                    {Array.from({ length: 4 }).map((_, index) => (
                      <Skeleton key={index} className="h-10 w-full" />
                    ))}
                  </div>
                ) : templatesQuery.isError ? (
                  <Alert variant="destructive" className="m-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>{t("common.error")}</AlertTitle>
                    <AlertDescription>
                      {templatesQuery.error?.message ?? t("builder.loadError")}
                    </AlertDescription>
                  </Alert>
                ) : (
                  <ScrollArea className="max-h-[320px]">
                    <ul className="divide-y">
                      {templates.map((item) => (
                        <li key={item.id}>
                          <button
                            type="button"
                            onClick={() => setSelectedTemplateId(item.id)}
                            className={
                              "flex w-full items-start gap-2 p-3 text-left transition hover:bg-muted/50 focus:outline-none focus-visible:ring" +
                              (selectedTemplateId === item.id ? " bg-muted" : "")
                            }
                          >
                            <div className="flex-1">
                              <p className="font-medium text-sm">{item.title}</p>
                              <p className="text-xs text-muted-foreground line-clamp-2">
                                {item.description}
                              </p>
                            </div>
                            <Badge variant="secondary" className="mt-1">
                              {item.category?.name}
                            </Badge>
                          </button>
                        </li>
                      ))}
                      {templates.length === 0 && (
                        <li className="p-3 text-sm text-muted-foreground">{t("builder.noTemplates")}</li>
                      )}
                    </ul>
                  </ScrollArea>
                )}
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{t("builder.pagination", { page, pages: totalPages })}</span>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                    disabled={page === 1 || templatesQuery.isLoading}
                  >
                    <RefreshCw className="h-4 w-4" style={{ transform: "rotate(180deg)" }} />
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={page >= totalPages || templatesQuery.isLoading}
                  >
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              {templateDetailQuery.isLoading ? (
                <BuilderSkeleton />
              ) : templateDetailQuery.isError ? (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>{t("common.error")}</AlertTitle>
                  <AlertDescription>
                    {templateDetailQuery.error?.message ?? t("builder.templateLoadError")}
                  </AlertDescription>
                </Alert>
              ) : template ? (
                <Tabs defaultValue="build" className="space-y-4">
                  <TabsList>
                    <TabsTrigger value="build">{t("builder.variables")}</TabsTrigger>
                    <TabsTrigger value="preview">{t("builder.preview")}</TabsTrigger>
                  </TabsList>
                  <TabsContent value="build" className="space-y-4">
                    <form onSubmit={handleRun} className="space-y-6" noValidate>
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
                          <p className="text-sm text-muted-foreground">{t("builder.noVariables")}</p>
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <Button type="submit" disabled={startUsage.isPending || completeUsage.isPending} className="gap-2">
                          {(startUsage.isPending || completeUsage.isPending) && (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          )}
                          <Play className="h-4 w-4" />
                          {t("builder.runOptimizer")}
                        </Button>
                        <Button type="button" variant="outline" onClick={() => form.reset()}>
                          {t("builder.resetBuilder")}
                        </Button>
                      </div>
                    </form>
                  </TabsContent>
                  <TabsContent value="preview">
                    <Card className="border bg-muted/40">
                      <CardHeader>
                        <CardTitle className="text-sm font-medium">{t("builder.preview")}</CardTitle>
                        <CardDescription>{t("builder.previewDescription")}</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <ScrollArea className="max-h-[320px] rounded border bg-background p-4">
                          <pre className="whitespace-pre-wrap text-sm leading-relaxed text-foreground">
                            {renderedPrompt || t("builder.previewPlaceholder")}
                          </pre>
                        </ScrollArea>
                        <div className="flex flex-wrap items-center gap-2">
                          <Button type="button" variant="outline" size="sm" className="gap-2" onClick={handleCopy}>
                            <Copy className="h-4 w-4" />
                            {t("builder.copyPrompt")}
                          </Button>
                          <Button type="button" variant="outline" size="sm" className="gap-2" onClick={() => handleExport("txt")}>
                            <Download className="h-4 w-4" />
                            {t("builder.exportText")}
                          </Button>
                          <Button type="button" variant="outline" size="sm" className="gap-2" onClick={() => handleExport("json")}>
                            <Upload className="h-4 w-4" />
                            {t("builder.exportJson")}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              ) : (
                <Alert>
                  <AlertTitle>{t("builder.selectTemplateTitle")}</AlertTitle>
                  <AlertDescription>{t("builder.selectTemplateDescription")}</AlertDescription>
                </Alert>
              )}
            </div>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}

function FieldInput({ field, register, error }: FieldInputProps) {
  const inputId = uilder-field-;
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
      </div>
      {renderField(field, baseProps)}
      {error && (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

function renderField(field: PromptField, props: Record<string, unknown>) {
  switch (field.field_type) {
    case "textarea":
      return <Textarea minRows={4} className="w-full" {...props} />;
    case "number":
      return <Input type="number" inputMode="decimal" {...props} />;
    default:
      return <Input {...props} />;
  }
}

function BuilderSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-10 w-64" />
      <Skeleton className="h-32 w-full" />
      <Skeleton className="h-48 w-full" />
    </div>
  );
}
