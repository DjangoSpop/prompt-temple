"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm, type UseFormRegister } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  useV2TemplatesAnalyzeWithAiCreateMutation,
  useV2TemplatesListQuery,
  useV2TemplatesRetrieveQuery,
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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Loader2, Sparkles, Wand2 } from "lucide-react";

import type { components } from "@/types/api";

const TOP_LIMIT = 10;

type PromptField = components["schemas"]["PromptField"];

type OptimizeSchema = ReturnType<typeof createTemplateSchema>;
type OptimizeValues = z.infer<OptimizeSchema>;

type FieldInputProps = {
  field: PromptField;
  register: UseFormRegister<Record<string, unknown>>;
  error?: string;
};

export default function OptimizePage() {
  const { t, direction } = useI18nStore();
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | undefined>(undefined);

  const templatesQuery = useV2TemplatesListQuery(
    { query: { ordering: "-popularity_score", page: 1 } },
    { staleTime: 5 * 60_000, onError: (error) => toast.error(error?.message ?? t("common.error")) }
  );

  const templates = templatesQuery.data?.results?.slice(0, TOP_LIMIT) ?? [];

  const templateDetail = useV2TemplatesRetrieveQuery(
    selectedTemplateId ? { pathParams: { id: selectedTemplateId } } : undefined,
    {
      enabled: Boolean(selectedTemplateId),
      onError: (error) => toast.error(error?.message ?? t("common.error")),
    }
  );
  const template = templateDetail.data;

  const schema = useMemo<OptimizeSchema>(() => createTemplateSchema(template?.fields ?? [], t), [template?.fields, t]);
  const form = useForm<OptimizeValues>({
    resolver: zodResolver(schema),
    defaultValues: useMemo(() => createDefaultValues(template?.fields ?? []) as OptimizeValues, [template?.fields]),
  });

  useEffect(() => {
    if (template) {
      form.reset(createDefaultValues(template.fields ?? []) as OptimizeValues);
    }
  }, [template, form]);

  const analyzer = useV2TemplatesAnalyzeWithAiCreateMutation({
    onError: (error) => toast.error(error?.message ?? t("common.error")),
  });

  const [analysisResult, setAnalysisResult] = useState<components["schemas"]["TemplateDetail"] | null>(null);

  const handleAnalyze = form.handleSubmit(async (values) => {
    if (!selectedTemplateId) {
      toast.error(t("optimize.selectTemplateWarning"));
      return;
    }
    const payload = {
      title: template?.title ?? "",
      description: template?.description ?? "",
      category: template?.category?.id ?? 0,
      template_content: renderTemplateContent(template?.template_content, template?.fields ?? [], values),
      version: template?.version,
      tags: template?.tags,
      fields_data: template?.fields,
    } satisfies components["schemas"]["TemplateDetailRequest"];

    const data = await analyzer.mutateAsync({
      pathParams: { id: selectedTemplateId },
      body: payload,
    });
    setAnalysisResult(data as components["schemas"]["TemplateDetail"]);
    toast.success(t("optimize.analysisComplete"));
  });

  return (
    <main className="space-y-6" dir={direction}>
      <Card className="border-none bg-background/60 backdrop-blur">
        <CardHeader>
          <CardTitle className="text-3xl font-semibold">{t("optimize.title")}</CardTitle>
          <CardDescription>{t("optimize.subtitle")}</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6 lg:grid-cols-[320px,1fr]">
          <div className="space-y-4">
            <Label htmlFor="optimize-template" className="text-xs font-medium uppercase tracking-wide">
              {t("optimize.templatePicker")}
            </Label>
            <Select
              value={selectedTemplateId ?? ""}
              onValueChange={(value) => setSelectedTemplateId(value || undefined)}
            >
              <SelectTrigger id="optimize-template">
                <SelectValue placeholder={t("optimize.selectTemplatePlaceholder") ?? ""} />
              </SelectTrigger>
              <SelectContent>
                {templates.map((item) => (
                  <SelectItem key={item.id} value={item.id}>
                    {item.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {templatesQuery.isLoading && (
              <div className="space-y-2">
                {Array.from({ length: 3 }).map((_, index) => (
                  <Skeleton key={index} className="h-8 w-full" />
                ))}
              </div>
            )}
            {templatesQuery.isError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>{t("common.error")}</AlertTitle>
                <AlertDescription>
                  {templatesQuery.error?.message ?? t("optimize.loadError")}
                </AlertDescription>
              </Alert>
            )}
            {template && (
              <div className="rounded-md border bg-muted/40 p-3 text-sm">
                <p className="font-semibold">{template.title}</p>
                <p className="text-muted-foreground">{template.description}</p>
                <div className="mt-2 flex flex-wrap gap-1">
                  <Badge variant="secondary">{template.category?.name}</Badge>
                  {template.tags && Array.isArray(template.tags) && template.tags.map((tag: string) => (
                    <Badge key={tag} variant="outline">{tag}</Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className="space-y-4">
            {templateDetail.isLoading ? (
              <OptimizeSkeleton />
            ) : templateDetail.isError ? (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>{t("common.error")}</AlertTitle>
                <AlertDescription>
                  {templateDetail.error?.message ?? t("optimize.templateLoadError")}
                </AlertDescription>
              </Alert>
            ) : template ? (
              <Tabs defaultValue="input" className="space-y-4">
                <TabsList>
                  <TabsTrigger value="input">{t("optimize.inputTab")}</TabsTrigger>
                  <TabsTrigger value="analysis">{t("optimize.analysisTab")}</TabsTrigger>
                </TabsList>
                <TabsContent value="input" className="space-y-4">
                  <form className="space-y-4" onSubmit={handleAnalyze} noValidate>
                    {(template.fields ?? []).map((field) => (
                      <FieldInput
                        key={field.id}
                        field={field}
                        register={form.register as UseFormRegister<Record<string, unknown>>}
                        error={form.formState.errors?.[field.id]?.message as string | undefined}
                      />
                    ))}
                    <div className="flex items-center gap-3">
                      <Button type="submit" disabled={analyzer.isPending} className="gap-2">
                        {analyzer.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wand2 className="h-4 w-4" />}
                        {t("optimize.runAnalysis")}
                      </Button>
                      <Button type="button" variant="outline" onClick={() => form.reset()}>
                        {t("optimize.resetForm")}
                      </Button>
                    </div>
                  </form>
                </TabsContent>
                <TabsContent value="analysis">
                  {analysisResult ? (
                    <Card className="border bg-muted/40">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-base">
                          <Sparkles className="h-4 w-4 text-primary" />
                          {t("optimize.analysisResult")}
                        </CardTitle>
                        <CardDescription>{t("optimize.analysisDescription")}</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3 text-sm">
                        <p><strong>{t("optimize.titleLabel")}:</strong> {analysisResult.title}</p>
                        <p><strong>{t("optimize.descriptionLabel")}:</strong> {analysisResult.description}</p>
                        <Separator />
                        <div className="space-y-1">
                          <p className="font-semibold">{t("optimize.fieldsHeading")}</p>
                          <ScrollArea className="max-h-[200px] rounded border bg-background p-3">
                            <pre className="whitespace-pre-wrap text-xs text-muted-foreground">
                              {JSON.stringify(analysisResult.fields, null, 2)}
                            </pre>
                          </ScrollArea>
                        </div>
                      </CardContent>
                    </Card>
                  ) : (
                    <Alert>
                      <AlertTitle>{t("optimize.noAnalysisTitle")}</AlertTitle>
                      <AlertDescription>{t("optimize.noAnalysisDescription")}</AlertDescription>
                    </Alert>
                  )}
                </TabsContent>
              </Tabs>
            ) : (
              <Alert>
                <AlertTitle>{t("optimize.selectTemplateTitle")}</AlertTitle>
                <AlertDescription>{t("optimize.selectTemplateDescription")}</AlertDescription>
              </Alert>
            )}
          </div>
        </CardContent>
      </Card>
    </main>
  );
}

function FieldInput({ field, register, error }: FieldInputProps) {
  const inputId = optimize-field-;
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
      {field.field_type === "textarea" ? (
        <Textarea minRows={3} className="w-full" {...baseProps} />
      ) : (
        <Input type={field.field_type === "number" ? "number" : "text"} {...baseProps} />
      )}
      {error && (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

function OptimizeSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-24 w-full" />
      <Skeleton className="h-32 w-full" />
    </div>
  );
}
