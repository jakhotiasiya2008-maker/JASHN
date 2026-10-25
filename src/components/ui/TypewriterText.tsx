import React, { useState, useEffect } from 'react';

interface TypewriterTextProps {
  text: string;
  speed?: number; // ms per char
  className?: string;
  onComplete?: () => void;
}

export const TypewriterText: React.FC<TypewriterTextProps> = ({
  text,
  speed = 12,
  className = '',
  onComplete,
}) => {
  const [displayedLength, setDisplayedLength] = useState(0);

  useEffect(() => {
    // If reduced motion is preferred, render instantly
    if (
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      setDisplayedLength(text.length);
      onComplete?.();
      return;
    }

    setDisplayedLength(0);
    let index = 0;

    const interval = setInterval(() => {
      index++;
      setDisplayedLength(index);
      if (index >= text.length) {
        clearInterval(interval);
        onComplete?.();
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed, onComplete]);

  return (
    <span className={className}>
      {text.slice(0, displayedLength)}
      {displayedLength < text.length && (
        <span className="inline-block w-1.5 h-3.5 ml-0.5 bg-accent-primary animate-pulse" />
      )}
    </span>
  );
};
