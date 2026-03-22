"use client";

import { useEffect, useMemo, useRef } from "react";
import {
  useGameSessionStore,
  type CommandOutcome,
} from "@/store/useGameSessionStore";
import { executeCaseCommand } from "@/lib/game/case-engine";
import { useTerminalAudio } from "@/hooks/useTerminalAudio";

export default function TerminalWindow() {
  const terminalHistory = useGameSessionStore((state) => state.terminalHistory);
  const currentInput = useGameSessionStore((state) => state.currentInput);
  const caseState = useGameSessionStore((state) => state.caseState);
  const currentDifficulty = useGameSessionStore(
    (state) => state.currentDifficulty,
  );

  const setCurrentInput = useGameSessionStore((state) => state.setCurrentInput);
  const addTerminalLines = useGameSessionStore(
    (state) => state.addTerminalLines,
  );
  const clearTerminalHistory = useGameSessionStore(
    (state) => state.clearTerminalHistory,
  );
  const setCaseState = useGameSessionStore((state) => state.setCaseState);
  const startSession = useGameSessionStore((state) => state.startSession);
  const completeSession = useGameSessionStore((state) => state.completeSession);
  const logCommand = useGameSessionStore((state) => state.logCommand);
  const commandLog = useGameSessionStore((state) => state.commandLog);

  const scrollRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const lastCountRef = useRef(0);
  const completionRef = useRef(false);

  const { playOutcome, playCompletion } = useTerminalAudio();

  useEffect(() => {
    if (!caseState.progress.completed) {
      startSession();
    }

    inputRef.current?.focus();
  }, [startSession, caseState.progress.completed]);

  useEffect(() => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [terminalHistory]);

  useEffect(() => {
    if (!commandLog.length) return;
    if (commandLog.length === lastCountRef.current) return;
    const lastCommand = commandLog[commandLog.length - 1];
    playOutcome(lastCommand.outcome);
    lastCountRef.current = commandLog.length;
  }, [commandLog, playOutcome]);

  useEffect(() => {
    if (caseState.progress.completed && !completionRef.current) {
      playCompletion();
      completionRef.current = true;
      return;
    }

    if (!caseState.progress.completed) {
      completionRef.current = false;
    }
  }, [caseState.progress.completed, playCompletion]);

  const prompt = useMemo(() => "agent@cubepath:~$", []);

  function handleSubmit() {
    const rawInput = currentInput.trim();

    if (!rawInput || caseState.progress.completed) return;

    addTerminalLines([
      {
        id: crypto.randomUUID(),
        type: "input",
        text: `${prompt} ${rawInput}`,
      },
    ]);

    if (rawInput.toLowerCase() === "clear") {
      clearTerminalHistory();
      logCommand(rawInput, "success");
      setCurrentInput("");
      inputRef.current?.focus();
      return;
    }

    const result = executeCaseCommand(currentDifficulty, rawInput, caseState);

    const outcome: CommandOutcome = result.lines.some(
      (line) => line.type === "error",
    )
      ? "error"
      : "success";

    if (result.lines.length > 0) {
      addTerminalLines(result.lines);
    }

    if (result.nextState) {
      setCaseState(result.nextState);
    }

    if (result.completed && !caseState.progress.completed) {
      completeSession();
    }

    logCommand(rawInput, outcome);
    setCurrentInput("");
    inputRef.current?.focus();
  }

  return (
    <div
      className="flex h-full min-h-0 min-w-0 w-full flex-col overflow-hidden bg-black/95 p-3 font-mono text-sm text-green-400"
      onClick={() => inputRef.current?.focus()}
    >
      <div
        ref={scrollRef}
        className="min-h-0 min-w-0 flex-1 overflow-y-auto overflow-x-hidden rounded-md border border-green-500/20 bg-black/70 p-3"
      >
        <div className="min-w-0 space-y-1.5">
          {terminalHistory.map((line) => (
            <p
              key={line.id}
              className={`w-full min-w-0 whitespace-pre-wrap break-all leading-relaxed ${
                line.type === "error"
                  ? "text-red-400"
                  : line.type === "success"
                    ? "text-emerald-400"
                    : line.type === "hint"
                      ? "text-yellow-300"
                      : line.type === "input"
                        ? "text-cyan-300"
                        : "text-green-400"
              }`}
            >
              {line.text}
            </p>
          ))}
        </div>
      </div>

      <div className="mt-3 flex min-w-0 items-center gap-2 rounded-md border border-green-500/20 bg-black/70 px-3 py-2">
        <span className="shrink-0 text-cyan-300">{prompt}</span>
        <input
          ref={inputRef}
          value={currentInput}
          onChange={(e) => setCurrentInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleSubmit();
            }
          }}
          disabled={caseState.progress.completed}
          className="min-w-0 w-full bg-transparent text-green-300 outline-none placeholder:text-green-700 disabled:cursor-not-allowed disabled:text-green-700"
          placeholder={
            caseState.progress.completed
              ? "Caso completado."
              : "Escribe un comando..."
          }
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck={false}
        />
      </div>
    </div>
  );
}
