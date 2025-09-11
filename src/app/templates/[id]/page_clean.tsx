'use client';

import { useParams } from 'next/navigation';
import TemplateDetailView from '@/components/TemplateDetailView';

export default function TemplateDetailPage() {
  const params = useParams();
  const templateId = params.id as string;

  return <TemplateDetailView templateId={templateId} />;
}
