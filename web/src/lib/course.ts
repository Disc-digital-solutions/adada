/**
 * University course codes ("MATH101", "Math 101", "math-101") written one way, so that a book or
 * notes listed under any spelling are found by any other. Students search by course, not by title.
 */
const CODE = /\b([A-Za-z]{2,4})[\s-]?(\d{3})\b/g;

/** "math 101" → "MATH101". Returns "" when the text is not a course code. */
export function normalizeCourse(text: string): string {
  const match = /^\s*([A-Za-z]{2,4})[\s-]?(\d{3})\s*$/.exec(text);
  return match ? (match[1] + match[2]).toUpperCase() : "";
}

/** Every course code in a text, normalized, without repeats, in the order they appear. */
export function courseCodesIn(text: string): string[] {
  const found: string[] = [];
  for (const match of text.matchAll(CODE)) {
    const code = (match[1] + match[2]).toUpperCase();
    // "TL 500" and "GB 128" are prices and sizes, not courses.
    if (/^(TL|TRY|GB|MB|KM|CM|MM|USD|EUR|GBP|STG)$/.test(match[1].toUpperCase())) continue;
    if (!found.includes(code)) found.push(code);
  }
  return found;
}
