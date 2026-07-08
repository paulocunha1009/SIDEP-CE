const MOJIBAKE_MARKERS = /Ã|Â|â[\u0080-\u009f]|[\u0080-\u009f]/;

function decodeMojibake(value: string) {
  if (!MOJIBAKE_MARKERS.test(value)) return value;

  try {
    const bytes = Uint8Array.from([...value].map((char) => char.charCodeAt(0) & 0xff));
    return new TextDecoder("utf-8", { fatal: false }).decode(bytes);
  } catch {
    return value;
  }
}

export function sanitizeText(value: string) {
  return decodeMojibake(value)
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
