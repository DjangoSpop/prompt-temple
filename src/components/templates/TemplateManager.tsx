/**
 * Enhanced Template Manager Component
 * Demonstrates full API integration with the PromptCraft backend
 */

'use client';

import React, { useState } from 'react';
import { Search, Plus, Filter, Grid, List, Star, TrendingUp } from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { 
  useTemplates, 
  useFeaturedTemplates, 
  useTrendingTemplates,
  useCategories,
  useCreateTemplate,
  useDeleteTemplate,
  useDuplicateTemplate,
  useStartTemplateUsage,
  useCompleteTemplateUsage,
  useRateTemplate
} from '../../lib/api/hooks';
import { TemplateQueryParams, TemplateCreateUpdateRequest } from '../../lib/api/types';
import { useAuth } from '../../lib/providers/AuthProvider';

interface TemplateManagerProps {
  className?: string;
}

export function TemplateManager({ className }: TemplateManagerProps) {
  const { isAuthenticated } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<number | undefined>();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFeatured, setShowFeatured] = useState(false);
  const [showTrending, setShowTrending] = useState(false);

  // Query parameters for templates
  const queryParams: TemplateQueryParams = {
    search: searchQuery || undefined,
    category: selectedCategory,
    is_featured: showFeatured || undefined,
    ordering: showTrending ? '-popularity_score' : undefined,
  };

  // API hooks
  const { data: templatesData, isLoading: templatesLoading } = useTemplates(queryParams);
  const { data: featuredTemplates } = useFeaturedTemplates();
  const { data: trendingTemplates } = useTrendingTemplates();
  const { data: categoriesData } = useCategories();

  // Mutations
  const createTemplate = useCreateTemplate();
  const deleteTemplate = useDeleteTemplate();
  const duplicateTemplate = useDuplicateTemplate();
  const startUsage = useStartTemplateUsage();
  const completeUsage = useCompleteTemplateUsage();
  const rateTemplate = useRateTemplate();

  const handleCreateTemplate = async (templateData: TemplateCreateUpdateRequest) => {
    try {
      await createTemplate.mutateAsync(templateData);
      // Handle success (e.g., show toast, redirect)
    } catch (error) {
      // Handle error
      console.error('Failed to create template:', error);
    }
  };

  const handleDeleteTemplate = async (templateId: string) => {
    if (window.confirm('Are you sure you want to delete this template?')) {
      try {
        await deleteTemplate.mutateAsync(templateId);
        // Handle success
      } catch (error) {
        console.error('Failed to delete template:', error);
      }
    }
  };

  const handleDuplicateTemplate = async (templateId: string) => {
    try {
      await duplicateTemplate.mutateAsync({
        id: templateId,
        data: { title: 'Copy of Template', is_public: false }
      });
      // Handle success
    } catch (error) {
      console.error('Failed to duplicate template:', error);
    }
  };

  const handleStartUsage = async (templateId: string) => {
    try {
      const result = await startUsage.mutateAsync({
        id: templateId,
        data: { session_id: `session-${Date.now()}` }
      });
      // Handle success - maybe redirect to template editor
      console.log('Usage started:', result);
    } catch (error) {
      console.error('Failed to start template usage:', error);
    }
  };

  const handleCompleteUsage = async (templateId: string, success: boolean) => {
    try {
      await completeUsage.mutateAsync({
        id: templateId,
        data: {
          usage_id: `usage-${Date.now()}`, // This should come from startUsage
          success,
          output: success ? 'Template completed successfully' : undefined,
        }
      });
      // Handle success
    } catch (error) {
      console.error('Failed to complete template usage:', error);
    }
  };

  const handleRateTemplate = async (templateId: string, rating: number, review?: string) => {
    try {
      await rateTemplate.mutateAsync({
        id: templateId,
        data: { rating, review }
      });
      // Handle success
    } catch (error) {
      console.error('Failed to rate template:', error);
    }
  };

  if (templatesLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 ${className}`}>
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-4 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center shadow-xl egyptian-pulse">
              <Star className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-5xl font-bold text-amber-900 mb-2 hieroglyph-border">
                Sacred Templates
              </h1>
              <p className="text-xl text-amber-700">
                Discover ancient wisdom for modern prompts
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-amber-900">
                Template Library
              </h2>
              <p className="text-amber-700 mt-1">
                Discover and create AI prompt templates
              </p>
            </div>
            {isAuthenticated && (
              <Button 
                className="egyptian-button"
                onClick={() => {/* Open create template modal */}}
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Template
              </Button>
            )}
          </div>

          {/* Quick Access Sections */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Featured Templates */}
            <Card className="pyramid-card p-6">
              <div className="flex items-center gap-2 mb-3">
                <Star className="h-5 w-5 text-amber-500" />
                <h3 className="font-semibold text-amber-900">Featured Templates</h3>
              </div>
              <div className="space-y-2">
                {featuredTemplates?.slice(0, 3).map((template) => (
                  <div 
                    key={template.id} 
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-amber-50 transition-colors field-focus-animation"
                  >
                    <div>
                      <p className="font-medium text-sm text-amber-900">{template.title}</p>
                      <p className="text-xs text-amber-600">{template.category.name}</p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-amber-300 hover:border-amber-500 hover:bg-amber-50"
                      onClick={() => handleStartUsage(template.id)}
                    >
                      Use
                    </Button>
                  </div>
                ))}
              </div>
            </Card>

            {/* Trending Templates */}
            <Card className="pyramid-card p-6">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="h-5 w-5 text-emerald-500" />
                <h3 className="font-semibold text-amber-900">Trending Templates</h3>
              </div>
          </div>
          <div className="space-y-2">
            {trendingTemplates?.slice(0, 3).map((template) => (
              <div 
                key={template.id} 
                className="flex items-center justify-between p-2 rounded hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <div>
                  <p className="font-medium text-sm">{template.title}</p>
                  <p className="text-xs text-gray-500">
                    {template.usage_count} uses • {template.average_rating.toFixed(1)} ⭐
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleStartUsage(template.id)}
                >
                  Use
                </Button>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <select
          value={selectedCategory || ''}
          onChange={(e) => setSelectedCategory(e.target.value ? Number(e.target.value) : undefined)}
          className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Categories</option>
          {categoriesData?.results.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>

        <div className="flex gap-2">
          <Button
            variant={showFeatured ? "default" : "outline"}
            size="sm"
            onClick={() => setShowFeatured(!showFeatured)}
          >
            <Star className="h-4 w-4 mr-1" />
            Featured
          </Button>
          
          <Button
            variant={showTrending ? "default" : "outline"}
            size="sm"
            onClick={() => setShowTrending(!showTrending)}
          >
            <TrendingUp className="h-4 w-4 mr-1" />
            Trending
          </Button>
        </div>

        <div className="flex border rounded-lg">
          <Button
            variant={viewMode === 'grid' ? "default" : "ghost"}
            size="sm"
            onClick={() => setViewMode('grid')}
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? "default" : "ghost"}
            size="sm"
            onClick={() => setViewMode('list')}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Templates Grid/List */}
      <div className={
        viewMode === 'grid' 
          ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          : "space-y-4"
      }>
        {templatesData?.results.map((template) => (
          <Card key={template.id} className="p-6 hover:shadow-lg transition-shadow">
            <div className="space-y-4">
              {/* Template Header */}
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-1">{template.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2">
                    {template.description}
                  </p>
                </div>
                {template.is_featured && (
                  <Star className="h-5 w-5 text-yellow-500 fill-current" />
                )}
              </div>

              {/* Template Meta */}
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">
                  {template.category.name}
                </span>
                <div className="flex items-center gap-4">
                  <span>{template.usage_count} uses</span>
                  <span>{template.average_rating.toFixed(1)} ⭐</span>
                </div>
              </div>

              {/* Template Stats */}
              <div className="flex items-center justify-between text-xs text-gray-400">
                <span>By {template.author}</span>
                <span>{template.field_count} fields</span>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-2">
                <Button
                  size="sm"
                  onClick={() => handleStartUsage(template.id)}
                  className="flex-1"
                >
                  Use Template
                </Button>
                
                {isAuthenticated && (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDuplicateTemplate(template.id)}
                    >
                      Duplicate
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {/* Open rating modal */}}
                    >
                      Rate
                    </Button>
                  </>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      {templatesData && templatesData.results.length > 0 && (
        <div className="flex items-center justify-center gap-2 pt-6">
          <Button
            variant="outline"
            disabled={!templatesData.previous}
            onClick={() => {/* Handle previous page */}}
          >
            Previous
          </Button>
          
          <span className="text-sm text-gray-500">
            Showing {templatesData.results.length} of {templatesData.count} templates
          </span>
          
          <Button
            variant="outline"
            disabled={!templatesData.next}
            onClick={() => {/* Handle next page */}}
          >
            Next
          </Button>
        </div>
      )}

      {/* Empty State */}
      {templatesData?.results.length === 0 && (
        <div className="text-center py-12">
          <div className="text-amber-400 mb-4">
            <Search className="h-12 w-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-amber-900 mb-2">
            No templates found
          </h3>
          <p className="text-amber-700 mb-4">
            Try adjusting your search criteria or create a new template.
          </p>
          {isAuthenticated && (
            <Button 
              className="egyptian-button"
              onClick={() => {/* Open create template modal */}}
            >
              Create Your First Template
            </Button>
          )}
        </div>
      )}
        </div>
      </div>
    </div>
  );
}
