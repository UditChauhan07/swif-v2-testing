export function formatTimestamp(timestamp) {
    // Extract seconds and nanoseconds
    const { _seconds, _nanoseconds } = timestamp;
  
    // Create a Date object
    const date = new Date(_seconds * 1000 + _nanoseconds / 1000000);
  
    // Define options for formatting
    const options = {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    };
  
    // Format the date
    return date.toLocaleString("en-US", options);
  }