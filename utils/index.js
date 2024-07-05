
function convertToDate(dateString) {
    if (dateString.length !== 6) {
      throw new Error("Invalid date string format");
    }

    // Extract year, month, and day parts
    let year = parseInt(dateString.substring(0, 2), 10);
    let month = parseInt(dateString.substring(2, 4), 10) - 1; // Months are 0-indexed in JavaScript Date
    let day = parseInt(dateString.substring(5, 6), 10);

    if(year >= 50) {
      year += 1900;
    } else {
      year += 2000;
    }
    // Assuming the year is in the 1900s
    

    // Create and return the date
    return new Date(year, month, day);
  }

module.exports = {
    convertToDate   
}