import { format, getDay, startOfMonth, endOfMonth, addDays } from "date-fns";
import { ptBR } from "date-fns/locale";

export function getDayOfWeek(date: Date): number {
  return getDay(date);
}

export function formatDate(
  date: Date,
  formatStr: string = "dd/MM/yyyy"
): string {
  return format(date, formatStr, { locale: ptBR });
}

export function getMonthRange(date: Date) {
  return {
    start: startOfMonth(date),
    end: endOfMonth(date),
  };
}

export function generateTimeSlots(
  startHour: number = 8,
  endHour: number = 18,
  intervalMinutes: number = 60
): string[] {
  const slots: string[] = [];
  for (let hour = startHour; hour < endHour; hour++) {
    const minutes = [0, intervalMinutes === 30 ? 30 : 0];
    for (const minute of minutes) {
      const timeStr = `${hour.toString().padStart(2, "0")}:${minute
        .toString()
        .padStart(2, "0")}`;
      slots.push(timeStr);
    }
  }
  return slots;
}

export function isPastDate(date: Date): boolean {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const compareDate = new Date(date);
  compareDate.setHours(0, 0, 0, 0);
  return compareDate < now;
}
