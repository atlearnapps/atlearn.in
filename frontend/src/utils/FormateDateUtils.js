export default function formatDateUtils(date) {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
  const year = date.getFullYear();

  return `${day}-${month}-${year}`;
}

export function convertToDate(timeString) {
  // Regular expression to parse the date string
  const regex = /(\w+), (\w+) (\d+), (\d+) at (\d+):(\d+) (\w+)/;
  const match = timeString?.match(regex);

  if (!match) return null;

  // eslint-disable-next-line no-unused-vars
  const [_, day, month, date, year, hours, minutes, period] = match;
  const monthIndex = new Date(`${month} 1, 2020`).getMonth();
  const hours24 =
    period === "PM" ? (parseInt(hours) % 12) + 12 : parseInt(hours) % 12;

  return new Date(year, monthIndex, date, hours24, minutes);
}

export function calculateTimeDifference(startDate, endDate) {
  // Example usage

  // const startDate = "Tue, Jan 7, 2025, 8:40 PM";
  // const endDate = "Tue, Jan 7, 2025, 10:00 PM";
  // Convert date strings to Date objects
  const start = new Date(startDate);
  const end = new Date(endDate);

  // Calculate the difference in milliseconds
  const differenceInMilliseconds = end - start;

  // Convert to total minutes
  const differenceInMinutes = Math.floor(
    differenceInMilliseconds / (1000 * 60)
  );

  // Calculate hours and remaining minutes
  const hours = Math.floor(differenceInMinutes / 60);
  const minutes = differenceInMinutes % 60;

  // Format the result based on minutes
  return minutes === 0 ? `${hours} hr` : `${hours} hr ${minutes} min`;
}


