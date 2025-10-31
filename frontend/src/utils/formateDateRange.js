 export function formatDateRange(startDateStr, endDateStr) {
    // Parse the input date strings into Date objects
    const startDate = new Date(startDateStr);
    const endDate = new Date(endDateStr);

    // Function to format a single date
    function formatDate(date) {
      const options = {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
      };
      return date.toLocaleDateString("en-US", options);
    }

    // Function to format time
    function formatTime(date) {
      let hours = date.getHours();
      const minutes = date.getMinutes();
      const ampm = hours >= 12 ? "PM" : "AM";
      hours = hours % 12;
      hours = hours ? hours : 12; // the hour '0' should be '12'
      const formattedMinutes = minutes < 10 ? "0" + minutes : minutes;
      return `${hours}:${formattedMinutes} ${ampm}`;
    }

    // Format both dates and times
    const formattedStartDate = formatDate(startDate);
    // const formattedEndDate = formatDate(endDate);
    const formattedStartTime = formatTime(startDate);
    const formattedEndTime = formatTime(endDate);

    // Combine the formatted date and time
    return {
      formattedStartDate,
      formattedStartTime,
      formattedEndTime,
    };
  }