// src/calculateDates.js

async function calculateDates(monthsToAdd, startDate) {
    // Get today's date or use the provided start date
    let today;
    if (startDate) {
        today = new Date(startDate);
    } else {
        today = new Date();
    }

    let formattedStartDate = today.toISOString().split('T')[0]; // Format the start date as YYYY-MM-DD

    // Get the date after adding the specified number of months
    let endDate = new Date(today);
    endDate.setMonth(endDate.getMonth() + monthsToAdd);
    let formattedEndDate = endDate.toISOString().split('T')[0]; // Format the end date as YYYY-MM-DD

    // Calculate the difference in milliseconds
    let differenceInTime = endDate.getTime() - today.getTime();

    // Convert the difference from milliseconds to days
    let differenceInDays = differenceInTime / (1000 * 3600 * 24);
    let roundedDifferenceInDays = Math.round(differenceInDays);

    return {
        startDate: formattedStartDate,
        endDate: formattedEndDate,
        numberOfDays: roundedDifferenceInDays
    };
}

export default calculateDates;
