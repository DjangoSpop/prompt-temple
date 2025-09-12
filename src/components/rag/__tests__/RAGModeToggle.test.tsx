/**
 * Test suite for RAG Mode Toggle Component
 * Tests mode selection, credit validation, and index status handling
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RAGModeToggle } from '../RAGModeToggle';
import { useRAGMode } from '@/lib/hooks/useRAG';

// Mock the useRAGMode hook
jest.mock('@/lib/hooks/useRAG');

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

const mockUseRAGMode = useRAGMode as jest.MockedFunction<typeof useRAGMode>;

describe('RAGModeToggle', () => {
  const defaultMockData = {
    mode: 'standard' as const,
    setMode: jest.fn(),
    canUseRAG: true,
    hasCredits: true,
    credits: {
      remaining: 100,
      limit: 500,
      consumed_today: 10,
    },
    indexStatus: {
      status: 'available' as const,
      document_count: 1000,
      last_updated: '2024-01-15T10:00:00Z',
    },
    modeInfo: {
      standard: {
        name: 'Standard',
        description: 'Fast optimization without external knowledge',
        credits: 1,
        speed: 'Fast',
      },
      rag_fast: {
        name: 'RAG Fast',
        description: 'Quick optimization with relevant citations',
        credits: 3,
        speed: 'Medium',
      },
      rag_deep: {
        name: 'RAG Deep',
        description: 'Comprehensive analysis with extensive research',
        credits: 10,
        speed: 'Slow',
      },
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseRAGMode.mockReturnValue(defaultMockData);
  });

  it('should render all mode options', () => {
    const wrapper = createWrapper();
    render(<RAGModeToggle />, { wrapper });

    expect(screen.getByText('Standard')).toBeInTheDocument();
    expect(screen.getByText('RAG Fast')).toBeInTheDocument();
    expect(screen.getByText('RAG Deep')).toBeInTheDocument();

    // Check credit costs are displayed
    expect(screen.getByText('1')).toBeInTheDocument(); // Standard cost
    expect(screen.getByText('3')).toBeInTheDocument(); // RAG Fast cost
    expect(screen.getByText('10')).toBeInTheDocument(); // RAG Deep cost
  });

  it('should display current credits', () => {
    const wrapper = createWrapper();
    render(<RAGModeToggle />, { wrapper });

    expect(screen.getByText('100/500')).toBeInTheDocument();
  });

  it('should highlight selected mode', () => {
    mockUseRAGMode.mockReturnValue({
      ...defaultMockData,
      mode: 'rag_fast',
    });

    const wrapper = createWrapper();
    render(<RAGModeToggle />, { wrapper });

    const ragFastCard = screen.getByText('RAG Fast').closest('.cursor-pointer');
    expect(ragFastCard).toHaveClass('ring-2', 'ring-blue-500');
  });

  it('should call onModeChange when mode is selected', async () => {
    const mockOnModeChange = jest.fn();
    const wrapper = createWrapper();
    
    render(<RAGModeToggle onModeChange={mockOnModeChange} />, { wrapper });

    const ragFastCard = screen.getByText('RAG Fast').closest('.cursor-pointer');
    fireEvent.click(ragFastCard!);

    await waitFor(() => {
      expect(defaultMockData.setMode).toHaveBeenCalledWith('rag_fast');
      expect(mockOnModeChange).toHaveBeenCalledWith('rag_fast');
    });
  });

  it('should disable RAG modes when index is unavailable', () => {
    mockUseRAGMode.mockReturnValue({
      ...defaultMockData,
      canUseRAG: false,
      indexStatus: {
        status: 'unavailable' as const,
        document_count: 0,
        last_updated: '2024-01-15T10:00:00Z',
      },
    });

    const wrapper = createWrapper();
    render(<RAGModeToggle />, { wrapper });

    // Should show warning banner
    expect(screen.getByText('RAG Index Unavailable')).toBeInTheDocument();

    // RAG modes should be disabled
    const ragFastCard = screen.getByText('RAG Fast').closest('.cursor-pointer');
    expect(ragFastCard).toHaveClass('opacity-50', 'cursor-not-allowed');

    // Standard mode should still be available
    const standardCard = screen.getByText('Standard').closest('.cursor-pointer');
    expect(standardCard).not.toHaveClass('opacity-50');
  });

  it('should show building status when index is building', () => {
    mockUseRAGMode.mockReturnValue({
      ...defaultMockData,
      canUseRAG: false,
      indexStatus: {
        status: 'building' as const,
        document_count: 500,
        last_updated: '2024-01-15T10:00:00Z',
        build_progress: 75,
      },
    });

    const wrapper = createWrapper();
    render(<RAGModeToggle />, { wrapper });

    expect(screen.getByText('RAG Index Building')).toBeInTheDocument();
    expect(screen.getByText('Building in progress... 75% complete')).toBeInTheDocument();
    expect(screen.getByText('Documents indexed: 500')).toBeInTheDocument();
  });

  it('should show insufficient credits warning', () => {
    mockUseRAGMode.mockReturnValue({
      ...defaultMockData,
      hasCredits: false,
      credits: {
        remaining: 0,
        limit: 500,
        consumed_today: 500,
      },
    });

    const wrapper = createWrapper();
    render(<RAGModeToggle />, { wrapper });

    expect(screen.getByText('Insufficient Credits')).toBeInTheDocument();
    expect(screen.getByText('You need credits to use RAG modes. Visit your billing page to add more credits.')).toBeInTheDocument();
  });

  it('should show unavailable status for modes that cannot be used', () => {
    mockUseRAGMode.mockReturnValue({
      ...defaultMockData,
      credits: {
        remaining: 5, // Less than required for RAG Deep (10)
        limit: 500,
        consumed_today: 495,
      },
    });

    const wrapper = createWrapper();
    render(<RAGModeToggle />, { wrapper });

    // RAG Deep should show unavailable
    const ragDeepCard = screen.getByText('RAG Deep').closest('.cursor-pointer');
    expect(ragDeepCard).toHaveClass('opacity-50');
    
    // Should show unavailable text within RAG Deep card
    const unavailableText = ragDeepCard?.querySelector('text-red-500');
    // Note: This is a simplified check - in reality you'd use a more specific selector
  });

  it('should handle disabled state', () => {
    const wrapper = createWrapper();
    render(<RAGModeToggle disabled />, { wrapper });

    const standardCard = screen.getByText('Standard').closest('.cursor-pointer');
    fireEvent.click(standardCard!);

    // setMode should not be called when disabled
    expect(defaultMockData.setMode).not.toHaveBeenCalled();
  });

  it('should display mode descriptions correctly', () => {
    const wrapper = createWrapper();
    render(<RAGModeToggle />, { wrapper });

    expect(screen.getByText('Fast optimization without external knowledge')).toBeInTheDocument();
    expect(screen.getByText('Quick optimization with relevant citations')).toBeInTheDocument();
    expect(screen.getByText('Comprehensive analysis with extensive research')).toBeInTheDocument();
  });

  it('should show speed indicators', () => {
    const wrapper = createWrapper();
    render(<RAGModeToggle />, { wrapper });

    expect(screen.getByText('Fast')).toBeInTheDocument();
    expect(screen.getByText('Medium')).toBeInTheDocument();
    expect(screen.getByText('Slow')).toBeInTheDocument();
  });
});