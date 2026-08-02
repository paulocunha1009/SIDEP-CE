const MOJIBAKE_MARKERS = /Ãƒ|Ã‚|Ã|Â|â[\u0080-\u009f]|[\u0080-\u009f]/;

const OFFICIAL_COMPONENT_NAMES = [
  { pattern: /INFORM.TICA\s+B.SICA/i, value: "INFORMÁTICA BÁSICA" },
  { pattern: /L.GICA\s+DE\s+PROGRAMA..O\s+II/i, value: "LÓGICA DE PROGRAMAÇÃO II" },
  { pattern: /L.GICA\s+DE\s+PROGRAMA..O\s+I/i, value: "LÓGICA DE PROGRAMAÇÃO I" },
  { pattern: /ARQUITETURA\s+E\s+MANUTEN..O\s+DE\s+COMPUTADORES/i, value: "ARQUITETURA E MANUTENÇÃO DE COMPUTADORES" },
  { pattern: /PROGRAMA..O\s+ORIENTADA\s+A\s+OBJETOS/i, value: "PROGRAMAÇÃO ORIENTADA A OBJETOS" },
  { pattern: /SISTEMAS\s+OPERACIONAIS/i, value: "SISTEMAS OPERACIONAIS" },
  { pattern: /HTML\/CSS/i, value: "HTML/CSS" },
  { pattern: /DESIGN\s+GR.FICO/i, value: "DESIGN GRÁFICO" },
  { pattern: /PROGRAMA..O\s+WEB/i, value: "PROGRAMAÇÃO WEB" },
  { pattern: /PROJETO\s+INTEGRADOR/i, value: "PROJETO INTEGRADOR" },
  { pattern: /BANCO\s+DE\s+DADOS/i, value: "BANCO DE DADOS" },
  { pattern: /LABORAT.RIO\s+DE\s+SOFTWARE/i, value: "LABORATÓRIO DE SOFTWARE" },
  { pattern: /LABORAT.RIO\s+DE\s+HARDWARE/i, value: "LABORATÓRIO DE HARDWARE" },
  { pattern: /REDES?\s+DE\s+COMPUTADORES/i, value: "REDES DE COMPUTADORES" },
  { pattern: /GERENCIADOR\s+DE\s+CONTE.DO/i, value: "GERENCIADOR DE CONTEÚDO" },
  { pattern: /PLANEJAMENTO\s+DE\s+CARREIRA/i, value: "PLANEJAMENTO DE CARREIRA" },
  { pattern: /NO..ES\s+DE\s+ROB.TICA/i, value: "NOÇÕES DE ROBÓTICA" },
];

function decodeMojibake(value: string) {
  if (!MOJIBAKE_MARKERS.test(value)) return value;

  try {
    const bytes = Uint8Array.from([...value].map((char) => char.charCodeAt(0) & 0xff));
    return new TextDecoder("utf-8", { fatal: false }).decode(bytes);
  } catch {
    return value;
  }
}

export function canonicalizeComponentName(value: string) {
  const candidate = value.trim();
  for (const item of OFFICIAL_COMPONENT_NAMES) {
    if (item.pattern.test(candidate)) return item.value;
  }
  return value;
}

export function sanitizeText(value: string) {
  const cleaned = decodeMojibake(value)
    .replace(/[\u2013\u2014]/g, " - ")
    .replace(/\u2192/g, "->")
    .replace(/\u2265/g, ">=")
    .replace(/\u2264/g, "<=")
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201c\u201d]/g, '"')
    .replace(/\u00a0/g, " ")
    .replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f-\u009f]/g, "")
    .replace(/[ \t]{2,}/g, " ")
    .replace(/\s+([,.?:;])/g, "$1")
    .trim();

  return canonicalizeComponentName(cleaned);
}

export function sanitizeRecordText<T extends object>(record: T): T {
  const sanitized = { ...record } as T;

  for (const key of Object.keys(sanitized) as Array<keyof T>) {
    const value = sanitized[key];
    if (typeof value === "string") {
      sanitized[key] = sanitizeText(value) as T[keyof T];
    }
  }

  return sanitized;
}
