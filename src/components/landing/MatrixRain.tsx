"use client";
import { useEffect, useRef, useState } from "react";

export const MatrixRain = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const desktopQuery = window.matchMedia("(min-width: 1024px)");

    const updateState = () => {
      setIsActive(!prefersReduced.matches && desktopQuery.matches);
    };

    updateState();
    prefersReduced.addEventListener("change", updateState);
    desktopQuery.addEventListener("change", updateState);

    return () => {
      prefersReduced.removeEventListener("change", updateState);
      desktopQuery.removeEventListener("change", updateState);
    };
  }, []);

  useEffect(() => {
    if (!isActive) {
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext("2d");
        ctx?.clearRect(0, 0, canvas.width, canvas.height);
      }
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.offsetWidth;
        canvas.height = parent.offsetHeight;
      }
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const characters = "01";
    const fontSize = 14;
    const columns = Math.max(1, Math.floor(canvas.width / fontSize));
    const drops: number[] = Array(columns).fill(1);

    const draw = () => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.08)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = "#10b981";
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = characters.charAt(
          Math.floor(Math.random() * characters.length),
        );
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.985) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };

    const interval = setInterval(draw, 90);

    return () => {
      clearInterval(interval);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [isActive]);

  return (
    <>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full -z-10 opacity-40 pointer-events-none"
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/80" />
    </>
  );
};
