/**
 * Workspace Page
 * Conversation history, saved prompts, and workspace management
 */

'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Search,
  Filter,
  Download,
  Star,
  Trash2,
  MessageSquare,
  FileText,
  Calendar,
  MoreHorizontal,
  Share2,
  Copy,
  Eye,
  Archive,
  FolderOpen,
  BookOpen,
  Clock
} from 'lucide-react';
import { useAuth } from '@/lib/hooks/useAuth';

interface ConversationItem {
  id: string;
  title: string;
  preview: string;
  message_count: number;
  created_at: string;
  updated_at: string;
  tags: string[];
  is_favorite: boolean;
  is_archived: boolean;
  model_used: string;
  mode: 'standard' | 'rag_fast' | 'rag_deep';
}

interface SavedPromptItem {
  id: string;
  title: string;
  content: string;
  description?: string;
  created_at: string;
  updated_at: string;
  tags: string[];
  is_favorite: boolean;
  usage_count: number;
  category: string;
}

// Mock data - replace with actual API calls
const mockConversations: ConversationItem[] = [
  {
    id: '1',
    title: 'Marketing Copy Optimization',
    preview: 'Help me create compelling marketing copy for a new SaaS product...',
    message_count: 12,
    created_at: '2024-01-15T10:30:00Z',
    updated_at: '2024-01-15T11:45:00Z',
    tags: ['marketing', 'copywriting', 'saas'],
    is_favorite: true,
    is_archived: false,
    model_used: 'deepseek-chat',
    mode: 'rag_deep'
  },
  {
    id: '2',
    title: 'Code Review Assistant',
    preview: 'Please review this React component and suggest improvements...',
    message_count: 8,
    created_at: '2024-01-14T14:20:00Z',
    updated_at: '2024-01-14T15:10:00Z',
    tags: ['code', 'react', 'review'],
    is_favorite: false,
    is_archived: false,
    model_used: 'deepseek-chat',
    mode: 'standard'
  }
];

const mockSavedPrompts: SavedPromptItem[] = [
  {
    id: '1',
    title: 'Content Strategy Template',
    content: 'Create a comprehensive content strategy for {{industry}} targeting {{audience}}...',
    description: 'A template for creating detailed content strategies',
    created_at: '2024-01-10T09:15:00Z',
    updated_at: '2024-01-12T16:30:00Z',
    tags: ['strategy', 'content', 'template'],
    is_favorite: true,
    usage_count: 15,
    category: 'Marketing'
  },
  {
    id: '2',
    title: 'Technical Documentation Helper',
    content: 'Help me write clear, comprehensive documentation for {{feature}}...',
    description: 'Template for creating technical documentation',
    created_at: '2024-01-08T11:00:00Z',
    updated_at: '2024-01-08T11:00:00Z',
    tags: ['documentation', 'technical', 'template'],
    is_favorite: false,
    usage_count: 7,
    category: 'Development'
  }
];

export default function WorkspacePage() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTab, setSelectedTab] = useState('conversations');
  const [conversations] = useState<ConversationItem[]>(mockConversations);
  const [savedPrompts] = useState<SavedPromptItem[]>(mockSavedPrompts);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const getModeColor = (mode: string) => {
    switch (mode) {
      case 'standard':
        return 'bg-blue-100 text-blue-700';
      case 'rag_fast':
        return 'bg-green-100 text-green-700';
      case 'rag_deep':
        return 'bg-purple-100 text-purple-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const filteredConversations = conversations.filter(conv =>
    conv.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const filteredPrompts = savedPrompts.filter(prompt =>
    prompt.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    prompt.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const ConversationCard = ({ conversation }: { conversation: ConversationItem }) => (
    <Card className="hover:shadow-md transition-shadow cursor-pointer">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-medium text-sm truncate">{conversation.title}</h3>
              {conversation.is_favorite && (
                <Star className="h-4 w-4 text-yellow-500 fill-current" />
              )}
            </div>
            <p className="text-xs text-gray-600 line-clamp-2">
              {conversation.preview}
            </p>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Eye className="h-4 w-4 mr-2" />
                View
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Copy className="h-4 w-4 mr-2" />
                Copy Link
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Archive className="h-4 w-4 mr-2" />
                Archive
              </DropdownMenuItem>
              <DropdownMenuItem className="text-red-600">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <MessageSquare className="h-3 w-3" />
              {conversation.message_count} messages
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {formatDate(conversation.updated_at)}
            </span>
          </div>
          <Badge variant="outline" className={getModeColor(conversation.mode)}>
            {conversation.mode.replace('_', ' ').toUpperCase()}
          </Badge>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex flex-wrap gap-1">
            {conversation.tags.slice(0, 3).map(tag => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
            {conversation.tags.length > 3 && (
              <Badge variant="secondary" className="text-xs">
                +{conversation.tags.length - 3}
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const SavedPromptCard = ({ prompt }: { prompt: SavedPromptItem }) => (
    <Card className="hover:shadow-md transition-shadow cursor-pointer">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-medium text-sm truncate">{prompt.title}</h3>
              {prompt.is_favorite && (
                <Star className="h-4 w-4 text-yellow-500 fill-current" />
              )}
            </div>
            {prompt.description && (
              <p className="text-xs text-gray-600 line-clamp-2">
                {prompt.description}
              </p>
            )}
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Eye className="h-4 w-4 mr-2" />
                Use Prompt
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Copy className="h-4 w-4 mr-2" />
                Copy
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="space-y-3">
          <div className="bg-gray-50 p-2 rounded text-xs font-mono line-clamp-3">
            {prompt.content}
          </div>
          
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center gap-4">
              <span>Used {prompt.usage_count} times</span>
              <span>{formatDate(prompt.updated_at)}</span>
            </div>
            <Badge variant="outline">{prompt.category}</Badge>
          </div>
          
          <div className="flex flex-wrap gap-1">
            {prompt.tags.slice(0, 3).map(tag => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
            {prompt.tags.length > 3 && (
              <Badge variant="secondary" className="text-xs">
                +{prompt.tags.length - 3}
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Workspace</h1>
          <p className="text-gray-600 mt-1">
            Your conversations, saved prompts, and workspace history
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export All
          </Button>
          <Button>
            <FileText className="h-4 w-4 mr-2" />
            New Prompt
          </Button>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search conversations and prompts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Filter by</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Favorites</DropdownMenuItem>
            <DropdownMenuItem>Recent</DropdownMenuItem>
            <DropdownMenuItem>Most Used</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Standard Mode</DropdownMenuItem>
            <DropdownMenuItem>RAG Fast</DropdownMenuItem>
            <DropdownMenuItem>RAG Deep</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Main Content */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-3 max-w-md">
          <TabsTrigger value="conversations" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Conversations
          </TabsTrigger>
          <TabsTrigger value="prompts" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Saved Prompts
          </TabsTrigger>
          <TabsTrigger value="folders" className="flex items-center gap-2">
            <FolderOpen className="h-4 w-4" />
            Folders
          </TabsTrigger>
        </TabsList>

        <TabsContent value="conversations" className="mt-6">
          {filteredConversations.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredConversations.map(conversation => (
                <ConversationCard key={conversation.id} conversation={conversation} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No conversations found</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm ? 'Try different search terms' : 'Start a conversation to see it here'}
              </p>
              <Button>Start New Conversation</Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="prompts" className="mt-6">
          {filteredPrompts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPrompts.map(prompt => (
                <SavedPromptCard key={prompt.id} prompt={prompt} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <BookOpen className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No saved prompts found</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm ? 'Try different search terms' : 'Save your first prompt to see it here'}
              </p>
              <Button>Create New Prompt</Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="folders" className="mt-6">
          <div className="text-center py-12">
            <FolderOpen className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Organize with Folders</h3>
            <p className="text-gray-600 mb-4">
              Create folders to organize your conversations and prompts
            </p>
            <Button>Create First Folder</Button>
          </div>
        </TabsContent>
      </Tabs>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-8 border-t">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">{conversations.length}</div>
          <div className="text-sm text-gray-600">Total Conversations</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">{savedPrompts.length}</div>
          <div className="text-sm text-gray-600">Saved Prompts</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-600">
            {conversations.filter(c => c.is_favorite).length + savedPrompts.filter(p => p.is_favorite).length}
          </div>
          <div className="text-sm text-gray-600">Favorites</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-orange-600">
            {savedPrompts.reduce((sum, prompt) => sum + prompt.usage_count, 0)}
          </div>
          <div className="text-sm text-gray-600">Total Usage</div>
        </div>
      </div>
    </div>
  );
}
