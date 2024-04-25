type DayOfWeek =
  | ""
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";

type Frequency = "daily" | "weekly" | "monthly";

interface ShipmentSchedule {
  frequency: Frequency;
  interval: number;
  timesPerDay?: number;
  dayOfWeek?: DayOfWeek;
  dayOfMonth?: number;
}

export function calculateNextShipmentDate(schedule: ShipmentSchedule): Date;

export function calculateNextShipmentDate(
  schedule: ShipmentSchedule,
  lastInstanceDate: Date
): Date;

export function calculateNextShipmentDate(
  schedule: ShipmentSchedule,
  lastInstanceDate?: Date
): Date {
  let nextInstanceDate = lastInstanceDate
    ? new Date(lastInstanceDate)
    : new Date();

  const { frequency, interval, timesPerDay, dayOfWeek, dayOfMonth } = schedule;

  switch (frequency) {
    case "daily":
      if (!timesPerDay) {
        throw new Error("Times per day is required for weekly frequency");
      }
      nextInstanceDate.setDate(nextInstanceDate.getDate() + interval);
      break;
    case "weekly":
      if (!dayOfWeek) {
        throw new Error("Day of the week is required for weekly frequency");
      }
      nextInstanceDate.setDate(nextInstanceDate.getDate() + 7 * interval);
      while (nextInstanceDate.getDay() !== getDayIndex(dayOfWeek)) {
        nextInstanceDate.setDate(nextInstanceDate.getDate() + 1);
      }
      break;
    case "monthly":
      if (!dayOfMonth) {
        throw new Error("Day of the month is required for monthly frequency");
      }
      nextInstanceDate.setMonth(nextInstanceDate.getMonth() + interval);
      const lastDayOfMonth = new Date(
        nextInstanceDate.getFullYear(),
        nextInstanceDate.getMonth() + 1,
        0
      ).getDate();
      if (dayOfMonth > lastDayOfMonth) {
        nextInstanceDate.setDate(lastDayOfMonth);
      }
      break;
    default:
      throw new Error("Invalid frequency");
  }

  return nextInstanceDate;
}

const getDayIndex = (dayOfWeek: DayOfWeek): number => {
  const days = {
    monday: 1,
    tuesday: 2,
    wednesday: 3,
    thursday: 4,
    friday: 5,
    saturday: 6,
    sunday: 0,
    "": -1,
  };

  if (!(dayOfWeek in days)) {
    throw new Error(`Invalid day of the week: ${dayOfWeek}`);
  }

  return days[dayOfWeek];
};
