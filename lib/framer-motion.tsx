"use client";
import React from "react";

type MotionProps<T> = T & { initial?: unknown; whileInView?: unknown; whileHover?: unknown; whileTap?: unknown; viewport?: unknown; transition?: unknown; animate?: unknown; exit?: unknown; };
function create<K extends keyof JSX.IntrinsicElements>(tag: K) {
  return React.forwardRef<HTMLElement, MotionProps<JSX.IntrinsicElements[K]>>(function MotionShim(props, ref) {
    return React.createElement(tag, { ...props, ref });
  });
}
export const motion = {
  div: create('div'), section: create('section'), header: create('header'), article: create('article'), aside: create('aside'), button: create('button'), img: create('img'), h1: create('h1'), h2: create('h2'), p: create('p'), span: create('span')
};
export function AnimatePresence({ children }: { children: React.ReactNode }) { return <>{children}</>; }
export function useReducedMotion() { return false; }
