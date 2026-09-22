import { useEffect } from "react";

const DEFAULT_TITLE = "DevTools Hub — Developer tools that stay in your browser";

/**
 * Sets document.title for the lifetime of the calling page. Kept as a tiny
 * hook rather than a routing/meta library, since a handful of static titles
 * is all this project currently needs.
 */
export function useDocumentTitle(title: string) {
  useEffect(() => {
    const previous = document.title;
    document.title = title;
    return () => {
      document.title = previous;
    };
  }, [title]);
}

export { DEFAULT_TITLE };
