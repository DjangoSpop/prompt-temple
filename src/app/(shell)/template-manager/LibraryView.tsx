'use client';

import { useState, useEffect } from 'react';
import { Search, Filter, Star, TrendingUp, Grid3X3, List, Plus, Edit, Trash2, Copy } from 'lucide-react';
import TemplateCard from '@/components/TemplateCard';
import TemplateEditor from '@/components/TemplateEditor';
import SearchBar from '@/components/SearchBar';
import CategoryChips from '@/components/CategoryChips';
import { useTemplates, useTemplateCategories } from '@/lib/hooks/useDashboard';
import { useTemplateManagement } from '@/lib/hooks/useTemplateManagement';
import { apiClient } from '@/lib/api-client';
import type { Template, Category } from '@/lib/types';

export default function LibraryView() {
  const { templates, isLoading: templatesLoading, loadTemplates } = useTemplates();
  const { categories, isLoading: categoriesLoading } = useTemplateCategories();
  const templateManagement = useTemplateManagement();
  
  const [featuredTemplates, setFeaturedTemplates] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('featured');
  const [ratingFilter, setRatingFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  
  // Template editor state
  const [showEditor, setShowEditor] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<string | undefined>(undefined);

  useEffect(() => {
    console.log('Library page viewed');
    loadFeaturedTemplates();
  }, []);

  useEffect(() => {
    const filters: any = {};
    
    if (searchQuery) {
      filters.search = searchQuery;
    }
    
    if (selectedCategory) {
      filters.category = selectedCategory;
    }
    
    if (typeFilter) {
      filters.is_public = typeFilter === 'free';
    }
    
    if (sortBy && sortBy !== 'featured') {
      filters.ordering = sortBy === 'rating' ? '-average_rating' : 
                        sortBy === 'usage' ? '-usage_count' : 
                        sortBy === 'newest' ? '-created_at' : '';
    }
    
    loadTemplates(filters);
  }, [searchQuery, selectedCategory, sortBy, typeFilter]);

  const loadFeaturedTemplates = async () => {
    try {
      const featured = await apiClient.getFeaturedTemplates();
      setFeaturedTemplates(featured);
    } catch (error) {
      console.error('Failed to load featured templates:', error);
    }
  };

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId === selectedCategory ? '' : categoryId);
  };

  // Template CRUD handlers
  const handleCreateTemplate = () => {
    setEditingTemplate(undefined);
    setShowEditor(true);
  };

  const handleEditTemplate = (templateId: string) => {
    setEditingTemplate(templateId);
    setShowEditor(true);
  };

  const handleCloseEditor = () => {
    setShowEditor(false);
    setEditingTemplate(undefined);
  };

  const handleTemplateAction = async (action: string, template: Template) => {
    try {
      switch (action) {
        case 'edit':
          handleEditTemplate(template.id);
          break;
        case 'duplicate':
          await templateManagement.duplicateTemplate(template.id);
          // Refresh templates list
          loadTemplates();
          break;
        case 'delete':
          if (window.confirm(`Are you sure you want to delete "${template.name || (template as any).title}"?`)) {
            await templateManagement.deleteTemplate(template.id);
            // Refresh templates list
            loadTemplates();
          }
          break;
        case 'use':
          handleUseTemplate(template);
          break;
        case 'save':
          handleSaveTemplate(template);
          break;
        default:
          break;
      }
    } catch (error) {
      console.error(`Error performing ${action}:`, error);
    }
  };

  // Action handlers
  const handleUseTemplate = (template: Template) => {
    // TODO: Navigate to template editor with this template
    console.log('Using template:', template.name || (template as any).title);
  };

  const handleSaveTemplate = (template: Template) => {
    // TODO: Save template to user's collection
    console.log('Saving template:', template.name || (template as any).title);
  };

  const handleRateTemplate = (templateId: string, rating: number) => {
    // TODO: Submit rating to API
    console.log('Rating template:', templateId, 'with', rating, 'stars');
  };

  const loading = templatesLoading || categoriesLoading;

  if (loading && templates.length === 0) {
    return (
      <div className="flex-1 bg-bg-primary">
        {/* Header */}
        <div className="h-12 bg-bg-primary border-b border-border px-4 flex items-center">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-interactive-muted rounded animate-pulse" />
            <div className="w-24 h-4 bg-interactive-muted rounded animate-pulse" />
          </div>
        </div>
        
        {/* Content */}
        <div className="flex-1 p-6">
          <div className="space-y-4">
            <div className="w-full h-10 bg-interactive-muted rounded animate-pulse" />
            <div className="flex space-x-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="w-20 h-8 bg-interactive-muted rounded animate-pulse" />
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-48 bg-interactive-muted rounded animate-pulse" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Filter and search templates
  const filteredTemplates = templates.filter((template: Template) => {
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const templateName = template.name || (template as any).title || '';
      if (!templateName.toLowerCase().includes(query) && 
          !template.description?.toLowerCase().includes(query)) {
        return false;
      }
    }

    // Category filter
    if (selectedCategory) {
      const templateCategoryId = typeof template.category === 'string' 
        ? template.category 
        : (template.category as any)?.id?.toString();
      if (templateCategoryId !== selectedCategory) {
        return false;
      }
    }

    // Rating filter
    if (ratingFilter && template.rating && template.rating < parseInt(ratingFilter)) {
      return false;
    }

    // Type filter
    if (typeFilter) {
      if (typeFilter === 'free' && template.is_premium) return false;
      if (typeFilter === 'premium' && !template.is_premium) return false;
    }

    return true;
  });

  return (
    <div className="flex-1 bg-bg-primary">
      {/* Header */}
      <div className="h-12 bg-bg-primary border-b border-border px-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Star className="w-5 h-5 text-yellow" />
          <h1 className="text-text-primary font-semibold">
            {searchQuery ? `Search: "${searchQuery}"` : selectedCategory ? 
              (categories.find(c => c.id?.toString() === selectedCategory)?.name || 'Category') : 
              'Template Library'}
          </h1>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={handleCreateTemplate}
            className="flex items-center space-x-1 px-3 py-1.5 bg-brand hover:bg-brand-hover text-white rounded-md transition-colors"
            title="Create new template"
          >
            <Plus className="w-4 h-4" />
            <span className="text-sm">Create</span>
          </button>
          
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`p-2 rounded hover:bg-interactive-hover/10 transition-colors ${
              showFilters ? 'bg-interactive-hover/15 text-interactive-active' : 'text-interactive-normal'
            }`}
            title="Toggle filters"
          >
            <Filter className="w-4 h-4" />
          </button>
          
          <div className="flex bg-bg-secondary rounded overflow-hidden">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 transition-colors ${
                viewMode === 'grid' 
                  ? 'bg-brand text-white' 
                  : 'text-interactive-normal hover:text-interactive-hover hover:bg-interactive-hover/10'
              }`}
              title="Grid view"
            >
              <Grid3X3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 transition-colors ${
                viewMode === 'list' 
                  ? 'bg-brand text-white' 
                  : 'text-interactive-normal hover:text-interactive-hover hover:bg-interactive-hover/10'
              }`}
              title="List view"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Search */}
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search templates..."
          />

          {/* Categories */}
          <CategoryChips
            categories={categories}
            selectedCategory={selectedCategory}
            onCategorySelect={handleCategorySelect}
          />

          {/* Filters Panel */}
          {showFilters && (
            <div className="bg-bg-secondary rounded-lg p-4 border border-border">
              <h3 className="text-text-primary font-medium mb-3">Filters</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-text-secondary text-sm mb-2">Rating</label>
                  <select 
                    value={ratingFilter}
                    onChange={(e) => setRatingFilter(e.target.value)}
                    className="w-full bg-bg-tertiary border border-border rounded px-3 py-2 text-text-primary"
                  >
                    <option value="">Any rating</option>
                    <option value="4">4+ stars</option>
                    <option value="3">3+ stars</option>
                  </select>
                </div>
                <div>
                  <label className="block text-text-secondary text-sm mb-2">Type</label>
                  <select 
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                    className="w-full bg-bg-tertiary border border-border rounded px-3 py-2 text-text-primary"
                  >
                    <option value="">All templates</option>
                    <option value="free">Public</option>
                    <option value="premium">Private</option>
                  </select>
                </div>
                <div>
                  <label className="block text-text-secondary text-sm mb-2">Sort by</label>
                  <select 
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full bg-bg-tertiary border border-border rounded px-3 py-2 text-text-primary"
                  >
                    <option value="featured">Featured</option>
                    <option value="rating">Rating</option>
                    <option value="usage">Most used</option>
                    <option value="newest">Newest</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Templates Grid/List */}
          {filteredTemplates.length > 0 ? (
            <div className={
              viewMode === 'grid' 
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                : 'space-y-4'
            }>
              {filteredTemplates.map((template: Template) => (
                <TemplateCard
                  key={template.id}
                  template={template}
                  viewMode={viewMode}
                  onSelect={handleUseTemplate}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-text-muted mb-4">
                <Search className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2">
                  {loading ? 'Loading templates...' : 'No templates found'}
                </h3>
                <p className="text-sm">
                  {!loading && (searchQuery || selectedCategory)
                    ? 'Try adjusting your search or filters'
                    : loading ? 'Please wait while we fetch your templates' : 'No templates available'}
                </p>
                {!loading && !searchQuery && !selectedCategory && (
                  <button
                    onClick={handleCreateTemplate}
                    className="mt-4 px-6 py-2 bg-brand hover:bg-brand-hover text-white rounded-lg transition-colors inline-flex items-center space-x-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Create Your First Template</span>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Load more button */}
          {templates.length > 0 && templates.length % 20 === 0 && (
            <div className="text-center pt-6">
              <button className="px-6 py-2 bg-brand hover:bg-brand-hover text-white rounded-lg transition-colors">
                Load More Templates
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Template Editor Modal */}
      {showEditor && (
        <TemplateEditor
          templateId={editingTemplate}
          onClose={handleCloseEditor}
          onSave={() => {
            // Refresh templates list after save
            loadTemplates();
          }}
        />
      )}
    </div>
  );
}