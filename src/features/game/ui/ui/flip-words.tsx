"use client";
import { AnimatePresence, domAnimation, LazyMotion, m } from "framer-motion";
import { useEffect, useState } from "react";
import { cn } from "@/features/game/ui/ui/lib/utils";

export const FlipWords = ({
  words,
  duration = 3000,
  className,
}: {
  words: string[];
  duration?: number;
  className?: string;
}) => {
  const [currentWord, setCurrentWord] = useState(words[0]);

  useEffect(() => {
    if (words.length === 0) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      const currentIndex = words.indexOf(currentWord);
      const nextIndex = currentIndex >= 0 ? currentIndex + 1 : 0;
      const nextWord = words[nextIndex] || words[0];
      setCurrentWord(nextWord);
    }, duration);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [currentWord, duration, words]);

  return (
    <LazyMotion features={domAnimation}>
      <AnimatePresence>
        <m.div
          initial={{
            opacity: 0,
            y: 10,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            type: "spring",
            stiffness: 100,
            damping: 10,
          }}
          exit={{
            opacity: 0,
            y: -40,
            x: 40,
            filter: "blur(8px)",
            scale: 2,
            position: "absolute",
          }}
          className={cn(
            "z-10 inline-block relative text-left text-red-600",
            className,
          )}
          key={currentWord}
        >
          {currentWord.split(" ").map((word, wordIndex) => (
            <m.span
              key={word + wordIndex}
              initial={{ opacity: 0, y: 10, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{
                delay: wordIndex * 0.3,
                duration: 0.3,
              }}
              className="inline-block whitespace-nowrap"
            >
              {word.split("").map((letter, letterIndex) => (
                <m.span
                  key={word + wordIndex + letter + letterIndex}
                  initial={{ opacity: 0, y: 10, filter: "blur(8px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  transition={{
                    delay: wordIndex * 0.3 + letterIndex * 0.05,
                    duration: 0.2,
                  }}
                  className="inline-block"
                >
                  {letter}
                </m.span>
              ))}
            </m.span>
          ))}
        </m.div>
      </AnimatePresence>
    </LazyMotion>
  );
};
