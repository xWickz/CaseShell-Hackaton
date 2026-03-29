"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  useGameSessionStore,
  type CommandOutcome,
} from "@/store/useGameSessionStore";
import { executeCaseCommand } from "@/lib/game/case-engine";
import { useTerminalAudio } from "@/hooks/useTerminalAudio";
import { useGameUIStore } from "@/store/useGameUIStore";
import {
  createIntroLines,
  createResolveLines,
  getRandomAlert,
  toActiveAlert,
} from "@/data/game/random-alerts";

const ALERT_PROBABILITY = 0.25;
const MIN_COMMANDS_BETWEEN_ALERTS = 3;
const ALERT_SFX_FILES = [
  "/game/audio/audio1.mp3",
  "/game/audio/audio2.mp3",
  "/game/audio/audio3.mp3",
] as const;

export default function TerminalWindow() {
  const terminalHistory = useGameSessionStore((state) => state.terminalHistory);
  const currentInput = useGameSessionStore((state) => state.currentInput);
  const caseState = useGameSessionStore((state) => state.caseState);
  const currentDifficulty = useGameSessionStore(
    (state) => state.currentDifficulty,
  );
  const hasTimedOut = useGameSessionStore((state) => state.hasTimedOut);
  const isPaused = useGameSessionStore((state) => state.isPaused);

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
  const commandHistory = useGameSessionStore((state) => state.commandHistory);
  const activeAlert = useGameSessionStore((state) => state.activeAlert);
  const setActiveAlert = useGameSessionStore((state) => state.setActiveAlert);
  const clearActiveAlert = useGameSessionStore(
    (state) => state.clearActiveAlert,
  );
  const alertSoundsEnabled = useGameUIStore(
    (state) => state.alertSoundsEnabled,
  );

  const scrollRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const lastCountRef = useRef(0);
  const completionRef = useRef(false);
  const historyIndexRef = useRef<number | null>(null);
  const draftInputRef = useRef("");
  const lastAlertCommandRef = useRef(0);
  const alertAudioPoolRef = useRef<HTMLAudioElement[]>([]);
  const getRandom = useStableRandom();

  const { playOutcome, playCompletion } = useTerminalAudio();

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const pool = ALERT_SFX_FILES.map((src) => {
      const audio = new Audio(src);
      audio.preload = "auto";
      audio.volume = 0.45;
      return audio;
    });
    alertAudioPoolRef.current = pool;

    return () => {
      pool.forEach((audio) => audio.pause());
      alertAudioPoolRef.current = [];
    };
  }, []);

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
    if (!commandLog.length) {
      lastAlertCommandRef.current = 0;
    }
  }, [commandLog]);

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

  function resetHistoryNavigation() {
    historyIndexRef.current = null;
    draftInputRef.current = "";
  }

  function navigateHistory(direction: "up" | "down") {
    if (!commandHistory.length) return;

    if (direction === "up") {
      if (historyIndexRef.current === null) {
        draftInputRef.current = currentInput;
        historyIndexRef.current = commandHistory.length - 1;
      } else if (historyIndexRef.current > 0) {
        historyIndexRef.current -= 1;
      }

      if (historyIndexRef.current !== null) {
        setCurrentInput(commandHistory[historyIndexRef.current]);
      }
      return;
    }

    if (historyIndexRef.current === null) return;

    if (historyIndexRef.current < commandHistory.length - 1) {
      historyIndexRef.current += 1;
      setCurrentInput(commandHistory[historyIndexRef.current]);
    } else {
      historyIndexRef.current = null;
      setCurrentInput(draftInputRef.current);
    }
  }

  function maybeTriggerRandomAlert(commandsExecuted: number) {
    if (activeAlert) return;
    if (hasTimedOut) return;
    if (
      commandsExecuted - lastAlertCommandRef.current <
      MIN_COMMANDS_BETWEEN_ALERTS
    )
      return;
    if (getRandom() > ALERT_PROBABILITY) return;

    const definition = getRandomAlert();
    addTerminalLines(createIntroLines(definition));
    setActiveAlert(toActiveAlert(definition));
    lastAlertCommandRef.current = commandsExecuted;
    playAlertSfx();
  }

  function playAlertSfx() {
    if (!alertSoundsEnabled) return;
    const pool = alertAudioPoolRef.current;
    if (!pool.length) return;
    const index = Math.floor(getRandom() * pool.length);
    const audio = pool[index];
    if (!audio) return;
    audio.currentTime = 0;
    audio.play().catch(() => {
      // Autoplay restrictions may block playback until user interacts.
    });
  }

  function handleSubmit() {
    const rawInput = currentInput.trim();

    if (!rawInput || caseState.progress.completed || hasTimedOut) return;

    startSession();

    addTerminalLines([
      {
        id: crypto.randomUUID(),
        type: "input",
        text: `${prompt} ${rawInput}`,
      },
    ]);

    if (activeAlert) {
      if (rawInput === activeAlert.resolveCommand) {
        addTerminalLines(createResolveLines(activeAlert.resolveLines));
        clearActiveAlert();
        logCommand(rawInput, "success");
      } else {
        addTerminalLines([
          {
            id: crypto.randomUUID(),
            type: "error",
            text: `${activeAlert.reminder} Comando requerido: ${activeAlert.resolveCommand}.`,
          },
        ]);
        logCommand(rawInput, "error");
      }

      setCurrentInput("");
      resetHistoryNavigation();
      inputRef.current?.focus();
      return;
    }

    if (rawInput.toLowerCase() === "clear") {
      clearTerminalHistory();
      logCommand(rawInput, "success");
      setCurrentInput("");
      resetHistoryNavigation();
      inputRef.current?.focus();
      maybeTriggerRandomAlert(commandLog.length + 1);
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
    resetHistoryNavigation();
    inputRef.current?.focus();

    maybeTriggerRandomAlert(commandLog.length + 1);
  }

  const isInputDisabled =
    caseState.progress.completed || hasTimedOut || isPaused;

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
          onChange={(e) => {
            if (historyIndexRef.current !== null) {
              resetHistoryNavigation();
            }
            setCurrentInput(e.target.value);
          }}
          onKeyDown={(e) => {
            if (isInputDisabled) return;

            if (e.key === "ArrowUp") {
              e.preventDefault();
              navigateHistory("up");
              return;
            }

            if (e.key === "ArrowDown") {
              e.preventDefault();
              navigateHistory("down");
              return;
            }

            if (e.key === "Enter") {
              e.preventDefault();
              handleSubmit();
            }
          }}
          disabled={isInputDisabled}
          className="min-w-0 w-full bg-transparent text-green-300 outline-none placeholder:text-green-700 disabled:cursor-not-allowed disabled:text-green-700"
          placeholder={
            caseState.progress.completed
              ? "Caso completado."
              : hasTimedOut
                ? "Tiempo agotado. Caso fallido."
                : isPaused
                  ? "Partida pausada. Reanudando..."
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

function useStableRandom() {
  const [generator] = useState(() => {
    const seed = (crypto?.getRandomValues?.(new Uint32Array(1))[0] ?? 1) | 1;
    return createMulberry32(seed);
  });

  return useCallback(() => generator(), [generator]);
}

function createMulberry32(seed: number) {
  return () => {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
