// src/utils/tags.ts
export function parseTagsCSV(csv?: string): string[] {
    return (csv || "")
      .split(",")
      .map(t => t.trim())
      .filter(Boolean);
  }
  
  export function toTagsCSV(tags: string[]): string {
    return tags
      .map(t => t.trim())
      .filter(Boolean)
      .join(",");
  }
  
  export function uniqSorted(arr: string[]): string[] {
    return Array.from(new Set(arr)).sort((a, b) => a.localeCompare(b));
  }
  