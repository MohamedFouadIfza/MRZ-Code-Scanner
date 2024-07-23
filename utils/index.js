
function convertToDate(dob, forExpiry = false) {
  if (dob.length !== 6) {
    throw new Error("Invalid date string format");
  }
  // Extract year, month, and day from the input
  const year = dob.slice(0, 2);
  const month = dob.slice(2, 4) - 1; // Month is 0-indexed in the Date constructor
  const day = dob.slice(4, 6);
  let fullYear;
  if (!forExpiry) {
    // Assume the year is in the 2000s if the year is less than or equal to the current year
    const currentYear = new Date().getFullYear() % 100; // Get the last two digits of the current year
    fullYear = parseInt(year, 10) <= currentYear ? `20${year}` : `19${year}`;
  } else {
    fullYear = `20${year}`
  }


  // Create a new Date object
  const date = new Date(fullYear, month, day);

  // Format the date as DD/MM/YYYY
  const formattedDate = date.toLocaleDateString('en-GB').replaceAll('/', ",");

  return formattedDate;
}


function formateGPTDate(dt = "") {

  if (dt.includes(".")) {
    return dt.replaceAll(".", ",")
  } else if (dt.includes("/")) {
    return dt.replaceAll("/", ",")
  } else {
    return dt
  }
}
module.exports = {
  convertToDate,
  formateGPTDate
}