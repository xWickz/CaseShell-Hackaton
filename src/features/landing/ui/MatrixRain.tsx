"use client";
import type React from "react";
import { useEffect, useRef, useState } from "react";

interface MatrixBackgroundProps {
  color?: string;
  fontSize?: number;
  className?: string;
  speed?: number;
  opacity?: number;
}

export const MatrixBackground: React.FC<MatrixBackgroundProps> = ({
  color = "#10b981",
  fontSize = 14,
  className = "",
  speed = 1,
  opacity = 0.4,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );
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
    if (!isActive) return;

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

    const chars = "01";
    const columns = Math.floor(canvas.width / fontSize);
    const drops: number[] = new Array(columns).fill(1);

    let animationFrameId: number;
    let lastTime = 0;
    const interval = 50;

    const draw = (currentTime: number) => {
      animationFrameId = requestAnimationFrame(draw);

      if (currentTime - lastTime < interval) return;
      lastTime = currentTime;

      ctx.fillStyle = "rgba(0, 0, 0, 0.08)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = color;
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.985) {
          drops[i] = 0;
        }
        drops[i] += speed;
      }
    };

    animationFrameId = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isActive, color, fontSize, speed]);

  if (!isActive) return null;

  return (
    <div
      className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ opacity: opacity }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/80" />
    </div>
  );
};

export default MatrixBackground;
