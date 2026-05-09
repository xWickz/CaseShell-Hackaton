"use client";
import { domAnimation, LazyMotion, m, useInView } from "framer-motion"; // Importamos useInView
import type React from "react";
import { useRef, useState } from "react";

export const TextHoverEffect = ({
  text,
  duration,
}: {
  text: string;
  duration?: number;
  automatic?: boolean;
}) => {
  const svgRef = useRef<SVGSVGElement>(null);

  const isInView = useInView(svgRef, { once: true, margin: "-100px" });

  const [hovered, setHovered] = useState(false);
  const [maskPosition, setMaskPosition] = useState({ cx: "50%", cy: "50%" });

  const handleMouseMove = (event: React.MouseEvent<SVGSVGElement>) => {
    if (!svgRef.current) return;
    const svgRect = svgRef.current.getBoundingClientRect();
    const cxPercentage = ((event.clientX - svgRect.left) / svgRect.width) * 100;
    const cyPercentage = ((event.clientY - svgRect.top) / svgRect.height) * 100;
    setMaskPosition({
      cx: `${cxPercentage}%`,
      cy: `${cyPercentage}%`,
    });
  };

  return (
    <LazyMotion features={domAnimation}>
      <svg
        ref={svgRef}
        width="100%"
        height="100%"
        viewBox="0 0 300 100"
        xmlns="http://www.w3.org/2000/svg"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onMouseMove={handleMouseMove}
        className="select-none"
      >
        <title> </title>
        <defs>
          <linearGradient
            id="textGradient"
            gradientUnits="userSpaceOnUse"
            cx="50%"
            cy="50%"
            r="25%"
          >
            {hovered && (
              <>
                <stop offset="0%" stopColor="#f87171" />
                <stop offset="25%" stopColor="#ef4444" />
                <stop offset="50%" stopColor="#b91c1c" />
                <stop offset="75%" stopColor="#7f1d1d" />
                <stop offset="100%" stopColor="#450a0a" />
              </>
            )}
          </linearGradient>

          <m.radialGradient
            id="revealMask"
            gradientUnits="userSpaceOnUse"
            r="20%"
            animate={maskPosition}
            transition={{ duration: duration ?? 0, ease: "easeOut" }}
          >
            <stop offset="0%" stopColor="white" />
            <stop offset="100%" stopColor="black" />
          </m.radialGradient>
          <mask id="textMask">
            <rect
              x="0"
              y="0"
              width="100%"
              height="100%"
              fill="url(#revealMask)"
            />
          </mask>
        </defs>

        {/* Texto de fondo (estático) */}
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dominantBaseline="middle"
          strokeWidth="0.3"
          className="fill-transparent stroke-neutral-200 font-[helvetica] text-5xl font-bold dark:stroke-neutral-800"
          style={{ opacity: hovered ? 0.7 : 0 }}
        >
          {text}
        </text>

        {/* Texto con efecto de dibujado (solo se activa isInView) */}
        <m.text
          x="50%"
          y="50%"
          textAnchor="middle"
          dominantBaseline="middle"
          strokeWidth="0.3"
          className="fill-transparent stroke-neutral-200 font-[helvetica] text-5xl font-bold dark:stroke-neutral-800"
          initial={{ strokeDashoffset: 1000, strokeDasharray: 1000 }}
          animate={
            isInView
              ? {
                  strokeDashoffset: 0,
                  strokeDasharray: 1000,
                }
              : {}
          }
          transition={{
            duration: 4,
            ease: "easeInOut",
          }}
        >
          {text}
        </m.text>

        {/* Texto con el gradiente rojo al hacer hover */}
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dominantBaseline="middle"
          stroke="url(#textGradient)"
          strokeWidth="0.3"
          mask="url(#textMask)"
          className="fill-transparent font-[helvetica] text-5xl font-bold"
        >
          {text}
        </text>
      </svg>
    </LazyMotion>
  );
};
