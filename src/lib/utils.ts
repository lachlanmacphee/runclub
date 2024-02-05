import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDateWithSuffix(date: Date) {
  const day = date.getDate();
  const month = date.toLocaleString("en-US", { month: "long" });
  const year = date.getFullYear();

  let dayString = day.toString();
  if (day >= 11 && day <= 13) {
    dayString += "th";
  } else {
    switch (day % 10) {
      case 1:
        dayString += "st";
        break;
      case 2:
        dayString += "nd";
        break;
      case 3:
        dayString += "rd";
        break;
      default:
        dayString += "th";
    }
  }

  return `${dayString} of ${month}, ${year}`;
}

export function hasDuplicates(array: unknown[]) {
  return new Set(array).size !== array.length;
}

export function convertLocationValueToLabel(value: string) {
  switch (value) {
    case "albertParkLake":
      return "Albert Park Lake";
    case "portMelbBeach":
      return "Port Melbourne Beach";
    case "southMelbBeach":
      return "South Melbourne Beach";
    case "tanGardens":
      return "Botanical Gardens";
    default:
      return "Location NOt Found";
  }
}

export function convertTimesToSeconds(
  hours: number,
  minutes: number,
  seconds: number
) {
  return seconds + minutes * 60 + hours * 3600;
}

export function formatTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  const formattedHours = hours.toString().padStart(2, "0");
  const formattedMinutes = minutes.toString().padStart(2, "0");
  const formattedSeconds = remainingSeconds.toString().padStart(2, "0");

  return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
}

export function getTuesdaysForNext3Months(): Date[] {
  const tuesdays: Date[] = [];
  const currentDate: Date = new Date();
  const endDate: Date = new Date(currentDate);
  endDate.setMonth(endDate.getMonth() + 3);

  while (currentDate < endDate) {
    if (currentDate.getDay() === 2) {
      const newDate = new Date(currentDate);
      newDate.setHours(0, 0, 0, 0);
      tuesdays.push(newDate);
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return tuesdays;
}
