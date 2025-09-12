/**
 * Citations Panel Component
 * Displays RAG citations with expandable snippets, sources, and relevance scores
 */

'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { 
  ChevronDown, 
  ChevronRight, 
  ExternalLink, 
  FileText, 
  Star,
  Copy,
  CheckCircle2
} from 'lucide-react';
import { RAGCitation } from '@/lib/hooks/useRAG';
import { cn } from '@/lib/utils';

interface CitationsPanelProps {
  citations: RAGCitation[];
  className?: string;
  title?: string;
  showEmpty?: boolean;
}

export const CitationsPanel: React.FC<CitationsPanelProps> = ({
  citations,
  className,
  title = "Sources & Citations",
  showEmpty = true
}) => {
  const [expandedCitations, setExpandedCitations] = useState<Set<number>>(new Set());
  const [copiedCitation, setCopiedCitation] = useState<number | null>(null);

  const toggleCitation = (index: number) => {
    const newExpanded = new Set(expandedCitations);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedCitations(newExpanded);
  };

  const copyCitation = async (citation: RAGCitation, index: number) => {
    const citationText = `"${citation.snippet}"\n\nSource: ${citation.title}\n${citation.url || citation.source}`;
    
    try {
      await navigator.clipboard.writeText(citationText);
      setCopiedCitation(index);
      setTimeout(() => setCopiedCitation(null), 2000);
    } catch (error) {
      console.error('Failed to copy citation:', error);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 0.8) return 'text-green-600 bg-green-100';
    if (score >= 0.6) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getStarRating = (score: number) => {
    const stars = Math.round(score * 5);
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={cn(
          "h-3 w-3",
          i < stars ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
        )}
      />
    ));
  };

  if (!citations.length && !showEmpty) {
    return null;
  }

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <FileText className="h-5 w-5" />
          {title}
          {citations.length > 0 && (
            <Badge variant="secondary" className="ml-auto">
              {citations.length} {citations.length === 1 ? 'source' : 'sources'}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-3">
        {citations.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <FileText className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <p className="text-sm">No citations available</p>
            <p className="text-xs text-gray-400 mt-1">
              Citations will appear here when using RAG optimization modes
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {citations.map((citation, index) => {
              const isExpanded = expandedCitations.has(index);
              const isCopied = copiedCitation === index;
              
              return (
                <Collapsible key={index} open={isExpanded} onOpenChange={() => toggleCitation(index)}>
                  <Card className="border border-gray-200 hover:border-gray-300 transition-colors">
                    <CollapsibleTrigger asChild>
                      <CardHeader className="cursor-pointer hover:bg-gray-50 transition-colors pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0 pr-3">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="font-medium text-sm leading-5 truncate">
                                {citation.title}
                              </h4>
                              <div className="flex items-center gap-1">
                                {getStarRating(citation.score)}
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                              <span className="truncate">
                                {citation.source}
                              </span>
                              <Badge 
                                variant="secondary" 
                                className={cn("text-xs font-medium", getScoreColor(citation.score))}
                              >
                                {Math.round(citation.score * 100)}%
                              </Badge>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-1">
                            {isExpanded ? (
                              <ChevronDown className="h-4 w-4 text-gray-400" />
                            ) : (
                              <ChevronRight className="h-4 w-4 text-gray-400" />
                            )}
                          </div>
                        </div>
                      </CardHeader>
                    </CollapsibleTrigger>
                    
                    <CollapsibleContent>
                      <CardContent className="pt-0 border-t border-gray-100">
                        <div className="space-y-3">
                          {/* Snippet */}
                          <div className="bg-gray-50 rounded-md p-3">
                            <p className="text-sm text-gray-700 leading-relaxed">
                              "{citation.snippet}"
                            </p>
                          </div>
                          
                          {/* Metadata */}
                          {citation.metadata && (
                            <div className="flex flex-wrap gap-2">
                              {citation.metadata.document_type && (
                                <Badge variant="outline" className="text-xs">
                                  {citation.metadata.document_type}
                                </Badge>
                              )}
                              {citation.metadata.last_updated && (
                                <Badge variant="outline" className="text-xs">
                                  Updated: {new Date(citation.metadata.last_updated).toLocaleDateString()}
                                </Badge>
                              )}
                              {citation.metadata.relevance_score && (
                                <Badge variant="outline" className="text-xs">
                                  Relevance: {Math.round(citation.metadata.relevance_score * 100)}%
                                </Badge>
                              )}
                            </div>
                          )}
                          
                          {/* Actions */}
                          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  copyCitation(citation, index);
                                }}
                                className="text-xs"
                              >
                                {isCopied ? (
                                  <>
                                    <CheckCircle2 className="h-3 w-3 mr-1" />
                                    Copied
                                  </>
                                ) : (
                                  <>
                                    <Copy className="h-3 w-3 mr-1" />
                                    Copy
                                  </>
                                )}
                              </Button>
                              
                              {citation.url && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  asChild
                                  className="text-xs"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <a 
                                    href={citation.url} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-1"
                                  >
                                    <ExternalLink className="h-3 w-3" />
                                    View Source
                                  </a>
                                </Button>
                              )}
                            </div>
                            
                            <div className="text-xs text-gray-500">
                              Score: {citation.score.toFixed(3)}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </CollapsibleContent>
                  </Card>
                </Collapsible>
              );
            })}
          </div>
        )}
        
        {citations.length > 0 && (
          <div className="text-xs text-gray-500 pt-3 border-t border-gray-100">
            <p>
              Citations are ranked by relevance score. Higher scores indicate more relevant sources.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CitationsPanel;