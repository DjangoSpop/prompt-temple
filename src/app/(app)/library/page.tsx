"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebounce } from "@/hooks/useDebounce";
import { useI18nStore } from "@/store/i18nStore";
import {
  useV2TemplateCategoriesListQuery,
  useV2TemplatesListQuery,
} from "@/hooks/api";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Filter,
  Loader2,
  RefreshCw,
  Search,
  Star,
  TrendingUp,
} from "lucide-react";

import type { OperationResponse } from "@/lib/apiClient";

const columnHelper = createColumnHelper<TemplateListItem>();

const ORDERING_OPTIONS = [
  { value: "-popularity_score", labelKey: "library.sortOptions.popular" },
  { value: "-average_rating", labelKey: "library.sortOptions.rating" },
  { value: "-created_at", labelKey: "library.sortOptions.newest" },
  { value: "title", labelKey: "library.sortOptions.alphabetical" },
];

type TemplatesListResponse = OperationResponse<"v2_templates_list">;
type TemplateListItem = TemplatesListResponse extends { results?: infer R }
  ? R extends readonly unknown[]
    ? R[number]
    : TemplatesListResponse extends { results?: (infer I)[] }
      ? I
      : never
  : never;

type TemplateCategoryResponse = OperationResponse<"v2_template_categories_list">;
type TemplateCategoryItem = TemplateCategoryResponse extends { results?: infer R }
  ? R extends readonly unknown[]
    ? R[number]
    : TemplateCategoryResponse extends { results?: (infer I)[] }
      ? I
      : never
  : never;

const PAGE_SIZE = 10;

export default function LibraryPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t, direction } = useI18nStore();
  const pathname = usePathname();


  const initialSearch = searchParams.get("q") ?? "";
  const initialCategory = searchParams.get("category") ?? "all";

  const [search, setSearch] = useState(initialSearch);
  const [category, setCategory] = useState<string>(initialCategory);
  const [ordering, setOrdering] = useState(ORDERING_OPTIONS[0]?.value ?? "-popularity_score");
  const [page, setPage] = useState<number>(Number(searchParams.get("page")) || 1);

  const debouncedSearch = useDebounce(search, 300);

  useEffect(() => {
    const params = new URLSearchParams();
    if (debouncedSearch) params.set('q', debouncedSearch);
    if (category !== 'all') params.set('category', category);
    if (ordering !== ORDERING_OPTIONS[0]?.value) params.set('ordering', ordering);
    if (page > 1) params.set('page', String(page));

    const queryString = params.toString();
    const href = queryString ? `${pathname}?${queryString}` : pathname;
    router.replace(href, { scroll: false });
  }, [debouncedSearch, category, ordering, page, pathname, router]);

  const templateQuery = useV2TemplatesListQuery(
    {
      query: {
        search: debouncedSearch || undefined,
        ordering: ordering || undefined,
        page,
        category: category !== "all" ? Number(category) : undefined,
      },
    },
    {
      placeholderData: (prev) => prev,
      staleTime: 60_000,
      onError: (err) => {
        toast.error(err?.message ?? t("common.error"));
      },
    }
  );

  const categoriesQuery = useV2TemplateCategoriesListQuery(
    { query: { ordering: "name", page: 1 } },
    {
      staleTime: 10 * 60_000,
      onError: (err) => {
        toast.error(err?.message ?? t("common.error"));
      },
    }
  );

  const templates = templateQuery.data?.results ?? [];
  const totalItems = templateQuery.data?.count ?? templates.length;
  const totalPages = totalItems > 0 ? Math.ceil(totalItems / PAGE_SIZE) : 1;

  const table = useReactTable({
    data: templates,
    columns: useMemo(
      () => [
        columnHelper.accessor("title", {
          header: () => t("library.columns.title"),
          cell: (info) => (
            <div className="space-y-1">
              <button
                type="button"
                onClick={() => router.push(`/template/${info.row.original.id}`)}
                className="text-left font-medium text-foreground hover:text-primary focus:outline-none focus-visible:ring focus-visible:ring-offset-2 focus-visible:ring-primary rounded"
              >
                {info.getValue()}
              </button>
              <p className="text-sm text-muted-foreground line-clamp-2" aria-label={t("library.columns.description")}>
                {info.row.original.description}
              </p>
              {info.row.original.is_featured && (
                <Badge variant="secondary" className="gap-1">
                  <TrendingUp className="h-3 w-3" /> {t("library.featured")}
                </Badge>
              )}
            </div>
          ),
        }),
        columnHelper.accessor((row) => row.category?.name ?? t("library.uncategorized"), {
          id: "category",
          header: () => t("library.columns.category"),
          cell: (info) => (
            <Badge variant="outline" className="capitalize">
              {info.getValue()}
            </Badge>
          ),
        }),
        columnHelper.accessor("usage_count", {
          header: () => t("library.columns.usage"),
          cell: (info) => <span className="tabular-nums">{info.getValue() ?? 0}</span>,
        }),
        columnHelper.accessor("average_rating", {
          header: () => t("library.columns.rating"),
          cell: (info) => (
            <span className="flex items-center gap-1">
              <Star className="h-4 w-4 text-yellow-500" aria-hidden />
              {info.getValue()?.toFixed(1) ?? "—"}
            </span>
          ),
        }),
        columnHelper.display({
          id: "actions",
          header: () => <span className="sr-only">{t("library.columns.actions")}</span>,
          cell: (info) => (
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push(`/template/${info.row.original.id}`)}
            >
              {t("library.useTemplate")}
            </Button>
          ),
        }),
      ],
      [router, t]
    ),
    getCoreRowModel: getCoreRowModel(),
  });

  const isLoading = templateQuery.isLoading;
  const isFetching = templateQuery.isFetching && !templateQuery.isLoading;
  const isError = templateQuery.isError;

  return (
    <main className="space-y-6" dir={direction}>
      <section>
        <Card className="border-none bg-background/60 backdrop-blur" aria-labelledby="library-heading">
          <CardHeader className="space-y-2">
            <CardTitle id="library-heading" className="text-3xl font-semibold tracking-tight">
              {t("library.title")}
            </CardTitle>
            <CardDescription>{t("library.subtitle")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className={cn("flex flex-col gap-4 md:flex-row md:items-end", direction === "rtl" && "md:flex-row-reverse")}
            >
              <div className="flex-1">
                <label htmlFor="library-search" className="sr-only">
                  {t("library.searchPlaceholder")}
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
                  <Input
                    id="library-search"
                    placeholder={t("library.searchPlaceholder") ?? ""}
                    value={search}
                    onChange={(event) => {
                      setSearch(event.target.value);
                      setPage(1);
                    }}
                    className="pl-9"
                    aria-describedby="library-search-description"
                  />
                </div>
                <p id="library-search-description" className="mt-1 text-xs text-muted-foreground">
                  {t("library.searchHint")}
                </p>
              </div>
              <div className="flex flex-1 flex-wrap gap-3 md:justify-end">
                <div className="min-w-[160px]">
                  <label htmlFor="library-order" className="block text-xs font-medium text-muted-foreground">
                    {t("library.sortBy")}
                  </label>
                  <Select
                    value={ordering}
                    onValueChange={(value) => {
                      setOrdering(value);
                      setPage(1);
                    }}
                  >
                    <SelectTrigger id="library-order" className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {ORDERING_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {t(option.labelKey)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="min-w-[160px]">
                  <label htmlFor="library-category" className="block text-xs font-medium text-muted-foreground">
                    {t("library.filterByCategory")}
                  </label>
                  <Select
                    value={category}
                    onValueChange={(value) => {
                      setCategory(value);
                      setPage(1);
                    }}
                  >
                    <SelectTrigger id="library-category" className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t("library.categories.all")}</SelectItem>
                      {(categoriesQuery.data?.results ?? []).map((item) => (
                        <SelectItem key={item.id} value={String(item.id)}>
                          {item.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  className="mt-6 inline-flex items-center gap-2"
                  onClick={() => {
                    setCategory("all");
                    setOrdering(ORDERING_OPTIONS[0]?.value ?? "-popularity_score");
                    setSearch("");
                    setPage(1);
                  }}
                >
                  <Filter className="h-4 w-4" />
                  {t("library.clearFilters")}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="space-y-4" aria-live={isFetching ? "polite" : "off"}>
        <Card className="border-none bg-background/60 backdrop-blur">
          <CardHeader>
            <div className="flex items-center justify-between gap-4">
              <div className="flex flex-col">
                <CardTitle className="text-lg font-semibold">
                  {t("library.tableTitle")}
                </CardTitle>
                <CardDescription>
                  {t("library.templateCount", { count: totalItems })}
                </CardDescription>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => templateQuery.refetch()}
                disabled={isFetching}
                className="gap-2"
              >
                <RefreshCw className={cn("h-4 w-4", isFetching && "animate-spin")} />
                {t("library.refresh")}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {isLoading ? (
              <LibrarySkeleton />
            ) : isError ? (
              <Alert variant="destructive" role="alert">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>{t("common.error")}</AlertTitle>
                <AlertDescription>
                  {templateQuery.error?.message ?? t("library.loadError")}
                </AlertDescription>
              </Alert>
            ) : templates.length === 0 ? (
              <EmptyState title={t("library.noResults")} description={t("library.noResultsDescription")} />
            ) : (
              <div className="overflow-hidden rounded-md border">
                <table className="w-full caption-bottom text-sm" role="grid">
                  <thead className="bg-muted/40">
                    {table.getHeaderGroups().map((headerGroup) => (
                      <tr key={headerGroup.id} className="border-b" role="row">
                        {headerGroup.headers.map((header) => (
                          <th
                            key={header.id}
                            role="columnheader"
                            className="px-4 py-3 text-left text-xs font-medium uppercase text-muted-foreground"
                          >
                            {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                          </th>
                        ))}
                      </tr>
                    ))}
                  </thead>
                  <tbody>
                    {table.getRowModel().rows.map((row) => (
                      <tr key={row.id} className="border-b last:border-none" role="row">
                        {row.getVisibleCells().map((cell) => (
                          <td key={cell.id} role="gridcell" className="px-4 py-4 align-top">
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <Separator />

            <div className="flex items-center justify-between text-sm">
              <p className="text-muted-foreground">
                {t("library.paginationSummary", {
                  page,
                  pages: totalPages,
                })}
              </p>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                  disabled={page === 1 || isLoading}
                  className="gap-1"
                >
                  <ArrowLeft className="h-4 w-4" />
                  {t("library.prev")}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={page >= totalPages || isLoading}
                  className="gap-1"
                >
                  {t("library.next")}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {isFetching && !isLoading && (
        <div className="fixed bottom-4 right-4 inline-flex items-center gap-2 rounded-full bg-background/90 px-4 py-2 shadow">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span className="text-sm text-muted-foreground">{t("library.updating")}</span>
        </div>
      )}
    </main>
  );
}

function EmptyState({ title, description }: { title: string; description?: string | null }) {
  return (
    <div className="flex flex-col items-center rounded-lg border border-dashed p-8 text-center">
      <Filter className="h-10 w-10 text-muted-foreground" aria-hidden />
      <h3 className="mt-4 text-lg font-semibold">{title}</h3>
      {description && <p className="mt-2 max-w-md text-sm text-muted-foreground">{description}</p>}
    </div>
  );
}

function LibrarySkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, index) => (
        <div key={index} className="flex items-start gap-3 rounded-md border p-4">
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="ml-auto h-8 w-28" />
        </div>
      ))}
    </div>
  );
}
