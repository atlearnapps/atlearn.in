export  default function extractTime(startdate, dateString) {
    // Split the date string into an array of parts
    const dateParts = dateString.split(", ");

    // Extract the time part from the array
    const timePart = startdate + " - " + dateParts[3];

    return timePart;
  }