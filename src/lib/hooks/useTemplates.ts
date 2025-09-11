import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import { templatesService } from '../api/templates';
import type { components } from '../../types/api';

type TemplateList = components['schemas']['TemplateList'];
type TemplateDetail = components['schemas']['TemplateDetail'];
type TemplateCreateUpdate = components['schemas']['TemplateCreateUpdateRequest'];
type PatchedTemplateUpdate = components['schemas']['PatchedTemplateCreateUpdateRequest'];

interface TemplateSearch {
  search?: string;
  category?: number;
  author?: string;
  is_featured?: boolean;
  is_public?: boolean;
  ordering?: string;
  page?: number;
}

interface TemplateRating {
  rating: number;
  review?: string;
}

interface TemplateUsageData {
  variables?: Record<string, any>;
  output?: string;
  success?: boolean;
  error_message?: string;
  completion_time?: number;
}

export const useTemplates = (filters?: TemplateSearch) => {
  const {
    data,
    isLoading,
    error,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['templates', 'list', filters],
    queryFn: ({ pageParam = 1 }) =>
      templatesService.getTemplates({ ...filters, page: pageParam }),
    getNextPageParam: (lastPage) => {
      if (!lastPage.next) return undefined;
      const url = new URL(lastPage.next);
      return Number(url.searchParams.get('page'));
    },
    initialPageParam: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const templates = data?.pages.flatMap(page => page.results || []) || [];
  const totalCount = data?.pages[0]?.count || 0;

  return {
    templates,
    totalCount,
    isLoading,
    error,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  };
};

export const useTemplate = (id: string | undefined) => {
  return useQuery({
    queryKey: ['templates', 'detail', id],
    queryFn: () => templatesService.getTemplate(id!),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useFeaturedTemplates = () => {
  return useQuery({
    queryKey: ['templates', 'featured'],
    queryFn: () => templatesService.getFeaturedTemplates(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useTrendingTemplates = () => {
  return useQuery({
    queryKey: ['templates', 'trending'],
    queryFn: () => templatesService.getTrendingTemplates(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useMyTemplates = () => {
  return useQuery({
    queryKey: ['templates', 'my'],
    queryFn: () => templatesService.getMyTemplates(),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useSearchSuggestions = () => {
  return useQuery({
    queryKey: ['templates', 'search-suggestions'],
    queryFn: () => templatesService.getSearchSuggestions(),
    staleTime: 30 * 60 * 1000, // 30 minutes
  });
};

export const useTemplateActions = () => {
  const queryClient = useQueryClient();

  const createTemplateMutation = useMutation({
    mutationFn: (templateData: TemplateCreateUpdate) =>
      templatesService.createTemplate(templateData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['templates'] });
    },
  });

  const updateTemplateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: PatchedTemplateUpdate }) =>
      templatesService.updateTemplate(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['templates', 'detail', id] });
      queryClient.invalidateQueries({ queryKey: ['templates', 'list'] });
      queryClient.invalidateQueries({ queryKey: ['templates', 'my'] });
    },
  });

  const deleteTemplateMutation = useMutation({
    mutationFn: (id: string) => templatesService.deleteTemplate(id),
    onSuccess: (_, id) => {
      queryClient.removeQueries({ queryKey: ['templates', 'detail', id] });
      queryClient.invalidateQueries({ queryKey: ['templates', 'list'] });
      queryClient.invalidateQueries({ queryKey: ['templates', 'my'] });
    },
  });

  const duplicateTemplateMutation = useMutation({
    mutationFn: (id: string) => templatesService.duplicateTemplate(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['templates'] });
    },
  });

  const rateTemplateMutation = useMutation({
    mutationFn: ({ id, rating }: { id: string; rating: TemplateRating }) =>
      templatesService.rateTemplate(id, rating),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['templates', 'detail', id] });
      queryClient.invalidateQueries({ queryKey: ['templates', 'list'] });
    },
  });

  const startUsageMutation = useMutation({
    mutationFn: (id: string) => templatesService.startTemplateUsage(id),
  });

  const completeUsageMutation = useMutation({
    mutationFn: ({ id, usageData }: { id: string; usageData: TemplateUsageData }) =>
      templatesService.completeTemplateUsage(id, usageData),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['templates', 'detail', id] });
      queryClient.invalidateQueries({ queryKey: ['templates', 'analytics', id] });
    },
  });

  const analyzeWithAIMutation = useMutation({
    mutationFn: (id: string) => templatesService.analyzeTemplateWithAI(id),
  });

  return {
    // Mutations
    createTemplate: createTemplateMutation.mutate,
    updateTemplate: updateTemplateMutation.mutate,
    deleteTemplate: deleteTemplateMutation.mutate,
    duplicateTemplate: duplicateTemplateMutation.mutate,
    rateTemplate: rateTemplateMutation.mutate,
    startUsage: startUsageMutation.mutate,
    completeUsage: completeUsageMutation.mutate,
    analyzeWithAI: analyzeWithAIMutation.mutate,

    // Loading states
    isCreating: createTemplateMutation.isPending,
    isUpdating: updateTemplateMutation.isPending,
    isDeleting: deleteTemplateMutation.isPending,
    isDuplicating: duplicateTemplateMutation.isPending,
    isRating: rateTemplateMutation.isPending,
    isStartingUsage: startUsageMutation.isPending,
    isCompletingUsage: completeUsageMutation.isPending,
    isAnalyzing: analyzeWithAIMutation.isPending,

    // Error states
    createError: createTemplateMutation.error,
    updateError: updateTemplateMutation.error,
    deleteError: deleteTemplateMutation.error,
    duplicateError: duplicateTemplateMutation.error,
    rateError: rateTemplateMutation.error,
    startUsageError: startUsageMutation.error,
    completeUsageError: completeUsageMutation.error,
    analyzeError: analyzeWithAIMutation.error,

    // Success data
    createResult: createTemplateMutation.data,
    updateResult: updateTemplateMutation.data,
    duplicateResult: duplicateTemplateMutation.data,
    rateResult: rateTemplateMutation.data,
    startUsageResult: startUsageMutation.data,
    completeUsageResult: completeUsageMutation.data,
    analyzeResult: analyzeWithAIMutation.data,
  };
};

export const useTemplateAnalytics = (id: string | undefined) => {
  return useQuery({
    queryKey: ['templates', 'analytics', id],
    queryFn: () => templatesService.getTemplateAnalytics(id!),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};