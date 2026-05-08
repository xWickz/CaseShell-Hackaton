import {
  ShaderLabComposition,
  type ShaderLabConfig,
} from "@basementstudio/shader-lab";
import type React from "react";
import { useEffect, useMemo, useRef, useState } from "react";

interface MyShaderProps {
  text?: string;
}

export const MyCustomShader: React.FC<MyShaderProps> = ({
  text = "caseshell",
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const baseSize = useMemo(() => ({ width: 1512, height: 949 }), []);
  const [containerSize, setContainerSize] = useState(baseSize);

  useEffect(() => {
    const element = containerRef.current;
    if (!element) {
      return;
    }

    const updateSize = () => {
      const nextWidth = Math.max(1, Math.round(element.clientWidth));
      const nextHeight = Math.max(1, Math.round(element.clientHeight));
      setContainerSize((prev) => {
        if (prev.width === nextWidth && prev.height === nextHeight) {
          return prev;
        }
        return { width: nextWidth, height: nextHeight };
      });
    };

    updateSize();

    const resizeObserver = new ResizeObserver(updateSize);
    resizeObserver.observe(element);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  const textScale = useMemo(() => {
    const widthScale = containerSize.width / baseSize.width;
    const heightScale = containerSize.height / baseSize.height;
    return Math.min(2, Math.max(0.6, Math.min(widthScale, heightScale)));
  }, [
    baseSize.height,
    baseSize.width,
    containerSize.height,
    containerSize.width,
  ]);

  const config = useMemo(() => {
    const rawConfig = {
      composition: {
        height: containerSize.height,
        width: containerSize.width,
      },
      layers: [
        {
          blendMode: "normal",
          compositeMode: "filter",
          maskConfig: { invert: false, mode: "multiply", source: "luminance" },
          hue: 0,
          id: "8f621e7b-a310-46d7-a2ed-6c015473d2bc",
          kind: "effect",
          name: "CRT",
          opacity: 1,
          params: {
            crtMode: "slot-mask",
            cellSize: 6,
            scanlineIntensity: 0.17,
            maskIntensity: 1,
            barrelDistortion: 0.15,
            chromaticAberration: 2,
            beamFocus: 0.58,
            brightness: 1.2,
            highlightDrive: 1,
            highlightThreshold: 0.62,
            shoulder: 0.25,
            chromaRetention: 1.15,
            shadowLift: 0.16,
            persistence: 0.18,
            vignetteIntensity: 0.45,
            flickerIntensity: 0.2,
            glitchIntensity: 0.13,
            glitchSpeed: 5,
            signalArtifacts: 0.45,
            bloomEnabled: true,
            bloomIntensity: 1.93,
            bloomThreshold: 0,
            bloomRadius: 24,
            bloomSoftness: 0.2,
          },
          saturation: 1,
          type: "crt",
          visible: true,
        },
        {
          blendMode: "normal",
          compositeMode: "filter",
          maskConfig: { invert: false, mode: "multiply", source: "luminance" },
          hue: 0,
          id: "6bfa2084-cf57-4f8a-bb49-57cfa1c74b1c",
          kind: "effect",
          name: "Dithering",
          opacity: 1,
          params: {
            preset: "custom",
            algorithm: "bayer-4x4",
            colorMode: "source",
            monoColor: "#f5f5f0",
            shadowColor: "#101010",
            highlightColor: "#f5f2e8",
            pixelSize: 2,
            spread: 0.5,
            levels: 3,
            dotScale: 1,
            animateDither: false,
            ditherSpeed: 1,
            chromaticSplit: false,
          },
          saturation: 1,
          type: "dithering",
          visible: true,
        },
        {
          blendMode: "normal",
          compositeMode: "mask",
          maskConfig: { invert: false, mode: "stencil", source: "luminance" },
          hue: 0,
          id: "0e3136ed-a783-4527-888d-269caeb49a9f",
          kind: "source",
          name: "Text",
          opacity: 1,
          params: {
            text: text,
            fontSize: Math.round(201 * textScale),
            fontFamily: "sans",
            fontWeight: 800,
            letterSpacing: -0.1,
            textColor: "#ffffff",
            backgroundColor: "#000000",
          },
          saturation: 1,
          type: "text",
          visible: true,
        },
        {
          blendMode: "normal",
          compositeMode: "filter",
          maskConfig: { invert: false, mode: "multiply", source: "luminance" },
          hue: 0,
          id: "99109d60-a6ce-44a8-9832-24905d6c14bb",
          kind: "effect",
          name: "Pattern",
          opacity: 1,
          params: {
            cellSize: 8,
            preset: "bars",
            colorMode: "source",
            monoColor: "#f5f5f0",
            bgOpacity: 0.16,
            invert: false,
            customColorCount: 4,
            customLuminanceBias: 0,
            customBgColor: "#F5F5F0",
            customColor1: "#0d1014",
            customColor2: "#4d5057",
            customColor3: "#969aa2",
            customColor4: "#e1e2de",
            bloomEnabled: true,
            bloomIntensity: 8,
            bloomThreshold: 0.03,
            bloomRadius: 9.5,
            bloomSoftness: 0.79,
          },
          saturation: 1,
          type: "pattern",
          visible: true,
        },
        {
          blendMode: "normal",
          compositeMode: "filter",
          maskConfig: { invert: false, mode: "multiply", source: "luminance" },
          hue: 0,
          id: "a924d323-7026-4b54-8738-355ef0d17009",
          kind: "source",
          name: "Gradient",
          opacity: 1,
          params: {
            preset: "neon-glow",
            activePoints: 2,
            point1Color: "#3D2020",
            point1Position: [0, 0],
            point1Weight: 0.6,
            point2Color: "#FF0000",
            point2Position: [-0.7, -0.5],
            point2Weight: 1.3,
            point3Color: "#662626",
            point3Position: [0.8, 0.3],
            point3Weight: 1.1,
            point4Color: "#220033",
            point4Position: [0.2, -0.8],
            point4Weight: 0.9,
            point5Color: "#1a0a2e",
            point5Position: [-0.5, 0.7],
            point5Weight: 1,
            noiseType: "voronoi",
            noiseSeed: 93.1,
            warpAmount: 0.3,
            warpScale: 3,
            warpIterations: 3,
            warpDecay: 1,
            warpBias: 0.35,
            vortexAmount: -0.25,
            animate: true,
            motionAmount: 0.81,
            motionSpeed: 2,
            falloff: 3.5,
            tonemapMode: "totos",
            glowStrength: 0,
            glowThreshold: 0,
            grainAmount: 0,
            vignetteStrength: 0.1,
            vignetteRadius: 1.5,
            vignetteSoftness: 1,
          },
          saturation: 1.15,
          type: "gradient",
          visible: true,
        },
      ],
      timeline: {
        duration: 8,
        loop: true,
        tracks: [],
      },
    };

    return rawConfig as unknown as ShaderLabConfig;
  }, [containerSize.height, containerSize.width, text, textScale]);

  return (
    <div
      ref={containerRef}
      className="flex items-center justify-center w-full h-full"
    >
      <ShaderLabComposition config={config} />
    </div>
  );
};
