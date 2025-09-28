export function extractMermaidCommentLines(code: string): string[] {
    if (!code) return [];
    const out: string[] = [];
    for (const raw of code.split(/\r?\n/)) {
      const s = raw.trimStart();
      if (s.startsWith("%%")) {
        // убираем ведущие %%, оставляем текст коммента
        out.push(s.replace(/^%%\s?/, ""));
      }
    }
    // убираем пустяки по краям
    while (out.length && !out[0].trim()) out.shift();
    while (out.length && !out[out.length - 1].trim()) out.pop();
    return out;
  }
  