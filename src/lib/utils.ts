import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Participant } from "@/lib/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
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

export function createRunDescription(
  participants: Participant[],
  location: string
) {
  const numParticipants = participants.length;
  const fastest5000mName = participants.find(
    (participant) => participant.distance == 5
  )?.name;
  const fastest3500mName = participants.find(
    (participant) => participant.distance == 3.5
  )?.name;

  let outputStr = `This week we had ${numParticipants} ${
    numParticipants == 0 ? "Gunny" : "Gunnies"
  } hit the track at ${location}.`;

  if (fastest5000mName && fastest3500mName) {
    outputStr += ` Congratulations to all participants, including ${fastest5000mName} for the fastest time in the 5km, and ${fastest3500mName} for the fastest time in the 3.5km.`;
  } else if (fastest5000mName) {
    outputStr += ` Congratulations to all participants, including ${fastest5000mName} for the fastest time in the 5km.`;
  } else if (fastest3500mName) {
    outputStr += ` Congratulations to all participants, including ${fastest3500mName} for the fastest time in the 3.5km.`;
  }

  return outputStr;
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getWeatherString(current: any) {
  const {
    temperature_2m,
    relative_humidity_2m,
    precipitation,
    wind_direction_10m,
    wind_speed_10m,
  } = current;
  return `Temperature: ${temperature_2m}°C, Humidity: ${relative_humidity_2m}%, Precipitation: ${precipitation}mm, Wind Direction: ${wind_direction_10m}°, Wind Speed: ${wind_speed_10m}km/h`;
}

export function getErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message;
  return String(error);
}
