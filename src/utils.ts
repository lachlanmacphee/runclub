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
