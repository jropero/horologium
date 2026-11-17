import React, { useEffect, useRef, useState } from 'react';
import { createAuroraRenderer } from '../utils/auroraGl';
import AuroraSvg from './AuroraSvg';

/**
 * Aurora borealis for a 300×200 weather SVG.
 *
 * Preferred path: a WebGL canvas (`utils/auroraGl.ts`) inserted into the DOM
 * right before the SVG this component is rendered in, covering the same box.
 * It therefore paints over the hero's sky background and under everything the
 * SVG and its later siblings draw (stars, sun, moon, skyline). The SVG must be
 * positioned (`position: absolute | relative`), otherwise the canvas would
 * paint over it.
 *
 * The SVG curtains of `AuroraSvg` are the second renderer. The menu turns each
 * one on separately (`gl` / `svg`); with both on, the SVG curtains draw over the
 * shader. When WebGL is unavailable, the shader fails to compile or the context
 * is lost, a `gl` request falls back to the SVG curtains.
 */

/** The shader runs at ~30 fps: the motion is slow, and it halves the GPU cost. */
const FRAME_MS = 1000 / 30 - 3;
/** Ground line of the hero skylines in the 300×200 viewBox. */
const GROUND_Y = 180;

interface Props {
  /** Draw the WebGL shader aurora. */
  gl: boolean;
  /** Draw the SVG curtains. */
  svg: boolean;
  /** True while the aurora fades out (the real weather is fading in). */
  leaving: boolean;
  fadeMs: number;
  /** Fade classes for the SVG curtains. */
  className?: string;
  style?: React.CSSProperties;
}

const Aurora: React.FC<Props> = ({ gl, svg: svgLayer, leaving, fadeMs, className, style }) => {
  const anchorRef = useRef<SVGGElement>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  /** False once WebGL turned out to be unusable here. */
  const [glOk, setGlOk] = useState(true);
  const useGl = gl && glOk;

  useEffect(() => {
    if (!useGl) return;
    const svg = anchorRef.current?.ownerSVGElement;
    const host = svg?.parentElement;
    const canvas = document.createElement('canvas');
    const renderer = svg && host ? createAuroraRenderer(canvas) : null;
    if (!svg || !host || !renderer) {
      setGlOk(false);
      return;
    }

    canvas.className = 'aurora-canvas';
    canvas.setAttribute('aria-hidden', 'true');
    canvas.style.transition = `opacity ${fadeMs}ms ease`;
    const zIndex = getComputedStyle(svg).zIndex;
    if (zIndex !== 'auto') canvas.style.zIndex = zIndex;
    host.insertBefore(canvas, svg);
    canvasRef.current = canvas;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const t0 = performance.now();
    const view = { horizon: GROUND_Y / 200 };
    const draw = (now: number) => renderer.render(40 + (now - t0) / 1000, view.horizon);

    // Match the SVG's box and find where its ground line falls inside it.
    const layout = () => {
      const box = svg.getBoundingClientRect();
      const parent = canvas.offsetParent ?? host;
      const origin = parent.getBoundingClientRect();
      canvas.style.left = `${box.left - origin.left - parent.clientLeft}px`;
      canvas.style.top = `${box.top - origin.top - parent.clientTop}px`;
      canvas.style.width = `${box.width}px`;
      canvas.style.height = `${box.height}px`;
      renderer.resize(box.width, box.height);
      const ctm = svg.getScreenCTM();
      if (ctm && box.height > 0) {
        const groundPx = ctm.d * GROUND_Y + ctm.f - box.top;
        view.horizon = Math.min(1, Math.max(0.5, groundPx / box.height));
      }
      draw(performance.now());
    };
    layout();

    const loop = { raf: 0, last: 0 };
    const tick = (now: number) => {
      loop.raf = requestAnimationFrame(tick);
      if (now - loop.last < FRAME_MS) return;
      loop.last = now;
      draw(now);
    };
    const start = () => {
      if (!loop.raf && !reducedMotion) loop.raf = requestAnimationFrame(tick);
    };
    const stop = () => {
      cancelAnimationFrame(loop.raf);
      loop.raf = 0;
    };

    const resizeObserver = new ResizeObserver(layout);
    resizeObserver.observe(svg);
    // Don't run the shader while the hero is scrolled out of view.
    const viewObserver = new IntersectionObserver(entries => {
      if (entries[entries.length - 1].isIntersecting) start();
      else stop();
    });
    viewObserver.observe(canvas);
    const onContextLost = () => setGlOk(false);
    canvas.addEventListener('webglcontextlost', onContextLost);
    start();

    return () => {
      stop();
      resizeObserver.disconnect();
      viewObserver.disconnect();
      canvas.removeEventListener('webglcontextlost', onContextLost);
      renderer.dispose();
      canvas.remove();
      canvasRef.current = null;
    };
  }, [useGl, fadeMs]);

  // Runs after the effect above: on mount the canvas starts at opacity 0 and fades in.
  useEffect(() => {
    if (canvasRef.current) canvasRef.current.style.opacity = leaving ? '0' : '1';
  }, [leaving, useGl]);

  const showSvg = svgLayer || (gl && !glOk);
  return (
    <>
      {useGl && <g ref={anchorRef} />}
      {showSvg && <AuroraSvg className={className} style={style} />}
    </>
  );
};

export default Aurora;
