"use client";

import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { QuizSlide, Slide } from "@/types/learning";

interface SlideViewerProps {
  slide: Slide;
  index: number;
  total: number;
  isCompleted: boolean;
  onCompleteSlide: () => void;
  onQuizSubmit?: (score: number) => void;
  onNext?: () => void;
  onPrev?: () => void;
}

export function SlideViewer({
  slide,
  index,
  total,
  isCompleted,
  onCompleteSlide,
  onQuizSubmit,
  onNext,
  onPrev,
}: SlideViewerProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [quizFeedback, setQuizFeedback] = useState<string | null>(null);
  const isQuiz = slide.type === "quiz";

  const statusBadge = useMemo(() => {
    if (isCompleted) {
      return <Badge variant="outline" className="border-emerald-500 text-emerald-600">Completed</Badge>;
    }
    return <Badge variant="outline">In progress</Badge>;
  }, [isCompleted]);

  const handleQuizSubmit = () => {
    if (!isQuiz || !selectedOption) {
      return;
    }
    const quizSlide = slide as QuizSlide;
    const option = quizSlide.options.find((item) => item.id === selectedOption);
    if (!option) {
      return;
    }
    setQuizFeedback(option.explanation);
    const score = option.isCorrect ? 1 : 0;
    onQuizSubmit?.(score);
  };

  const renderContent = () => {
    if (isQuiz) {
      const quizSlide = slide as QuizSlide;
      return (
        <div className="space-y-4">
          <p className="text-base text-foreground">{quizSlide.question}</p>
          <div className="space-y-3">
            {quizSlide.options.map((option) => {
              const isSelected = option.id === selectedOption;
              const showExplanation = Boolean(quizFeedback && isSelected);
              return (
                <button
                  key={option.id}
                  type="button"
                  className={cn(
                    "flex w-full items-start gap-3 rounded-md border px-4 py-3 text-left",
                    isSelected ? "border-primary bg-primary/10" : "border-border bg-background"
                  )}
                  onClick={() => setSelectedOption(option.id)}
                >
                  <span className="mt-1 flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full border" />
                  <div>
                    <p className="font-medium text-foreground">{option.label}</p>
                    {showExplanation && (
                      <p className="text-xs text-muted-foreground">{option.explanation}</p>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
          {quizFeedback && (
            <div className="rounded-md border border-emerald-500/40 bg-emerald-50/60 p-3 text-sm text-emerald-700">
              {quizFeedback}
            </div>
          )}
        </div>
      );
    }

    const paragraphs = slide.content.split("\n").filter(Boolean);
    return (
      <div className="space-y-4">
        {paragraphs.map((paragraph, idx) => (
          <p key={idx} className="text-base leading-relaxed text-foreground">
            {paragraph}
          </p>
        ))}
        {"promptExample" in slide && slide.promptExample && (
          <div className="rounded-md border border-primary/40 bg-primary/5 p-4">
            <p className="text-xs uppercase tracking-wide text-primary">Prompt example</p>
            <pre className="mt-2 whitespace-pre-line text-sm text-foreground">{slide.promptExample}</pre>
          </div>
        )}
        {"expectedOutcome" in slide && slide.expectedOutcome && (
          <div className="rounded-md border border-accent/40 bg-accent/10 p-4">
            <p className="text-xs uppercase tracking-wide text-accent-foreground">What good looks like</p>
            <p className="mt-2 text-sm text-accent-foreground">{slide.expectedOutcome}</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <section className="flex flex-1 flex-col gap-6">
      <header className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-wider text-muted-foreground">
            Slide {index + 1} of {total}
          </p>
          <h1 className="text-2xl font-semibold text-foreground">{slide.title}</h1>
        </div>
        {statusBadge}
      </header>
      <article className="rounded-lg border border-border/60 bg-card/60 p-6 shadow-sm">
        {renderContent()}
      </article>
      <footer className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Badge variant="outline">{isQuiz ? "Quiz" : "Workshop"}</Badge>
        </div>
        <div className="flex items-center gap-2">
          {onPrev && (
            <Button variant="ghost" onClick={onPrev}>
              Previous
            </Button>
          )}
          {isQuiz ? (
            <Button onClick={handleQuizSubmit} disabled={!selectedOption}>
              Submit quiz
            </Button>
          ) : (
            <Button onClick={onCompleteSlide}>
              Mark complete
            </Button>
          )}
          {onNext && (
            <Button variant="secondary" onClick={onNext}>
              Next
            </Button>
          )}
        </div>
      </footer>
    </section>
  );
}
