/**
 * The residence-permit reminder (ARR-11): how many days are left, when to start renewing, and a
 * calendar file (.ics) with two reminders that the student adds to their own phone calendar.
 * Dates are whole days in the island's calendar, written YYYY-MM-DD.
 */
const DAY = 24 * 60 * 60 * 1000;

function utc(date: string): number {
  return Date.parse(`${date}T00:00:00Z`);
}

export function isDate(value: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(utc(value)) && new Date(utc(value)).toISOString().startsWith(value);
}

/** Days from `today` to `date`; negative once it has passed. */
export function daysUntil(date: string, today: string): number {
  return Math.round((utc(date) - utc(today)) / DAY);
}

export function minusDays(date: string, days: number): string {
  return new Date(utc(date) - days * DAY).toISOString().slice(0, 10);
}

function icsDate(date: string): string {
  return date.replace(/-/g, "");
}

/** Text in an .ics file: commas, semicolons and backslashes escaped, new lines as \n. */
function icsText(text: string): string {
  return text.replace(/\\/g, "\\\\").replace(/[,;]/g, (c) => `\\${c}`).replace(/\n/g, "\\n");
}

/** Two all-day reminders: start the renewal, and one week before the permit ends. */
export function permitCalendar(input: {
  expiry: string;
  leadDays: number;
  startTitle: string;
  lastWeekTitle: string;
  note: string;
  stamp: string;
  /** Today; a reminder that would fall in the past is moved to today. */
  today?: string;
}): string {
  const atLeastToday = (date: string) => (input.today && date < input.today ? input.today : date);
  const events = [
    { id: "start", date: atLeastToday(minusDays(input.expiry, input.leadDays)), title: input.startTitle },
    { id: "week", date: atLeastToday(minusDays(input.expiry, 7)), title: input.lastWeekTitle },
  ];
  const lines = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Island Market//Permit reminder//EN", "CALSCALE:GREGORIAN"];
  for (const e of events) {
    lines.push(
      "BEGIN:VEVENT",
      `UID:permit-${e.id}-${icsDate(input.expiry)}@island-market`,
      `DTSTAMP:${input.stamp}`,
      `DTSTART;VALUE=DATE:${icsDate(e.date)}`,
      `DTEND;VALUE=DATE:${icsDate(minusDays(e.date, -1))}`,
      `SUMMARY:${icsText(e.title)}`,
      `DESCRIPTION:${icsText(input.note)}`,
      "BEGIN:VALARM",
      "TRIGGER:PT9H",
      "ACTION:DISPLAY",
      `DESCRIPTION:${icsText(e.title)}`,
      "END:VALARM",
      "END:VEVENT",
    );
  }
  lines.push("END:VCALENDAR");
  // The format wants CRLF line ends.
  return lines.join("\r\n") + "\r\n";
}
