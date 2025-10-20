'use client';

import { motion } from 'framer-motion';
import { BookMarked, X, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface TemplateOpportunity {
  title: string;
  description: string;
  category: string;
  confidence: number;
}

interface TemplateOpportunityBannerProps {
  opportunity: TemplateOpportunity;
  onSaveAsTemplate?: () => void;
  onDismiss?: () => void;
  className?: string;
}

/**
 * TemplateOpportunityBanner - CTA for saving as template
 *
 * Triggered by template_opportunity WebSocket event
 * Shows toast-style notification suggesting to save conversation as template
 * On accept -> trigger template_created success toast
 */
export const TemplateOpportunityBanner: React.FC<TemplateOpportunityBannerProps> = ({
  opportunity,
  onSaveAsTemplate,
  onDismiss,
  className = ''
}) => {
  const [dismissed, setDismissed] = useState(false);

  const handleDismiss = () => {
    setDismissed(true);
    setTimeout(() => onDismiss?.(), 200);
  };

  const handleSave = () => {
    onSaveAsTemplate?.();
  };

  if (dismissed) return null;

  return (
    <motion.div
      className={cn(
        "bg-gradient-to-r from-sun/10 to-amber-50 border-2 border-sun/40",
        "rounded-cartouche shadow-lg p-4 flex items-start gap-4",
        className
      )}
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
      transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
    >
      {/* Icon */}
      <div className="bg-sun text-white p-2 rounded-temple flex-shrink-0">
        <BookMarked className="h-5 w-5" />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h4 className="font-heading font-semibold text-nile text-sm">
            Save as Template?
          </h4>
          <button
            onClick={handleDismiss}
            className="text-stone hover:text-nile transition-colors flex-shrink-0"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <p className="text-xs font-ui text-umber mb-2">
          This conversation looks like a great candidate for a template:{' '}
          <span className="font-semibold">{opportunity.title}</span>
        </p>

        <div className="flex items-center gap-2 text-xs font-ui text-stone mb-3">
          <span className="px-2 py-0.5 bg-white/50 rounded-full">
            {opportunity.category}
          </span>
          <span className="text-sun font-medium">
            {opportunity.confidence}% match
          </span>
        </div>

        {onSaveAsTemplate && (
          <button
            onClick={handleSave}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-cartouche",
              "bg-sun text-white font-ui font-medium text-xs",
              "hover:bg-sun-hover transition-all shadow-md hover:shadow-lg"
            )}
          >
            <BookMarked className="h-3.5 w-3.5" />
            Save as Template
            <ArrowRight className="h-3 w-3" />
          </button>
        )}
      </div>
    </motion.div>
  );
};
