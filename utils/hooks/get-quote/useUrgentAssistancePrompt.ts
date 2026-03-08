'use client';

import { useCallback, useEffect, useState } from 'react';

interface UseUrgentAssistancePromptOptions {
  delayMs?: number;
}

const DEFAULT_DELAY_MS = 10000;

export default function useUrgentAssistancePrompt({
  delayMs = DEFAULT_DELAY_MS,
}: UseUrgentAssistancePromptOptions = {}) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setIsVisible(true);
    }, delayMs);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [delayMs]);

  const dismiss = useCallback(() => {
    setIsVisible(false);
  }, []);

  return {
    isVisible,
    dismiss,
  };
}
