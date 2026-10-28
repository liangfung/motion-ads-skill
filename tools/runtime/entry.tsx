import * as React from "react";
import * as ReactDOMClient from "react-dom/client";
import * as Remotion from "remotion";
import { Player } from "@remotion/player";
import { PlayerApp } from "./PlayerApp";
import type { AdProps } from "./types";
export { React, ReactDOMClient, Remotion, Player };

const placeholders = new Set([
  "Product name",
  "Replace with a source-backed description.",
  "One clear reason to care.",
  "Verified feature",
]);
export function validate(props: AdProps) {
  if (!props || typeof props !== "object")
    throw Error("Provide a motionAd configuration.");
  for (const key of ["width", "height", "fps"] as const)
    if (!Number.isInteger(props[key]) || props[key] <= 0)
      throw Error(`${key} must be a positive integer.`);
  if (!Number.isFinite(props.durationSeconds) || props.durationSeconds <= 0)
    throw Error("durationSeconds must be positive.");
  for (const key of ["title", "description", "ctaLabel", "ctaHref"] as const)
    if (typeof props[key] !== "string" || !props[key].trim())
      throw Error(`Provide ${key}.`);
  const visit = (value: unknown): void => {
    if (
      typeof value === "string" &&
      (placeholders.has(value.trim()) || /^Replace with\b/.test(value))
    )
      throw Error("Replace the scaffold copy before review.");
    if (Array.isArray(value)) value.forEach(visit);
    else if (value && typeof value === "object")
      Object.values(value).forEach(visit);
  };
  visit(props);
  if (props.ctaHref?.startsWith("#")) {
    if (!document.getElementById(props.ctaHref.slice(1)))
      throw Error("ctaHref needs an existing page target.");
  } else {
    let target: URL;
    try {
      target = new URL(props.ctaHref);
    } catch {
      throw Error(
        "ctaHref must be an absolute HTTP(S) URL or an existing page target.",
      );
    }
    if (
      !["https:", "http:"].includes(target.protocol) ||
      /(^|\.)example\.(com|org|net)$/.test(target.hostname)
    )
      throw Error("Provide the actual action destination in ctaHref.");
  }
  if (props.assets !== undefined && !Array.isArray(props.assets))
    throw Error("assets must be an array of local URLs.");
  const base = new URL(".", document.baseURI);
  for (const file of props.assets || []) {
    if (
      typeof file !== "string" ||
      !file ||
      /^(?:[a-z][\w+.-]*:|\/)/i.test(file)
    )
      throw Error("Use relative local asset URLs.");
    const url = new URL(file, base);
    if (url.origin !== base.origin || !url.pathname.startsWith(base.pathname))
      throw Error("Keep runtime assets inside this H5 folder.");
  }
  const frame = new URLSearchParams(location.search).get("frame");
  if (
    frame !== null &&
    (!/^\d+$/.test(frame) ||
      Number(frame) >= Math.round(props.durationSeconds * props.fps))
  )
    throw Error("The inspection frame is outside this composition.");
  return props;
}

let mounted = false;
let startupFailed = false;
const startupScripts = new Set(
  ["runtime.js", "config.js", "ad.js"].map(
    (file) => new URL(file, document.baseURI).href,
  ),
);
function showFailure(message: string) {
  if (startupFailed) return;
  startupFailed = true;
  const root = document.getElementById("app");
  if (!root) return;
  root.dataset.state = "error";
  root.replaceChildren();
  const note = document.createElement("p");
  note.textContent = message;
  root.append(note);
  const props = (window as any).motionAd;
  if (props && typeof props.title === "string") {
    const title = document.createElement("strong");
    title.textContent = props.title;
    root.prepend(title);
  }
}
export function mount(component: React.ComponentType<AdProps>, props: AdProps) {
  if (startupFailed) return null;
  try {
    if (mounted) throw Error("Mount one Player root per page.");
    validate(props);
    const root = document.getElementById("app");
    if (!root) throw Error("The page needs an #app element.");
    if (typeof component !== "function" && typeof component !== "object")
      throw Error("Provide a React composition component.");
    document.title = props.title;
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute("content", props.description);
    for (const [id, text] of [
      ["page-title", props.title],
      ["page-description", props.description],
    ]) {
      const node = document.getElementById(id);
      if (node) node.textContent = text;
    }
    window.remotion_staticFiles = (props.assets || []).map((file) => ({
      name: decodeURIComponent(
        file.replace(/^\.\//, "").replace(/^assets\//, ""),
      ),
      src: new URL(file, document.baseURI).href,
    })) as typeof window.remotion_staticFiles;
    const instance = ReactDOMClient.createRoot(root);
    instance.render(<PlayerApp component={component} props={props} />);
    mounted = true;
    return instance;
  } catch (error) {
    showFailure(
      error instanceof Error ? error.message : "The animation could not start.",
    );
    console.error(error);
    return null;
  }
}
window.addEventListener(
  "error",
  (event) => {
    if (mounted) return;
    const target = event.target as HTMLScriptElement;
    const source = event.filename || (target?.tagName === "SCRIPT" ? target.src : "");
    if (!source) return;
    let url: URL;
    try {
      url = new URL(source, document.baseURI);
    } catch {
      return;
    }
    url.search = "";
    url.hash = "";
    if (startupScripts.has(url.href))
      showFailure(event.message || "The animation script could not load.");
  },
  true,
);
// file:// previews mute script error details, so a broken ad.js may never be attributed above.
window.addEventListener("load", () => {
  if (!mounted)
    showFailure(
      "The animation did not start. Check config.js and ad.js for errors in the browser console.",
    );
});
