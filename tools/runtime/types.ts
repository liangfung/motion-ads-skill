export type Scene = {
  eyebrow: string;
  headline: string;
  body?: string;
  image?: string;
  images?: string[];
  labels?: string[];
  details?: { heading: string; body: string }[];
};
export type AdProps = {
  assets?: string[];
  title: string;
  description: string;
  brand: string;
  ctaLabel: string;
  ctaHref: string;
  width: number;
  height: number;
  fps: number;
  durationSeconds: number;
  bg: string;
  surface: string;
  accent: string;
  text: string;
  image?: string;
  scenes: Scene[];
  qaFrames?: number[];
};
