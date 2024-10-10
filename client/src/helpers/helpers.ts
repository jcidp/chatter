export const formatTimestamp = (timestamp: string) => {
  const date = new Date(timestamp);
  const now = new Date();

  const timestampDate = new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()),
  );
  const nowDate = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()),
  );

  const diffDays = Math.floor(
    (nowDate.getTime() - timestampDate.getTime()) / (1000 * 60 * 60 * 24),
  );

  if (diffDays === 0) {
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    hours %= 12;
    hours = hours ? hours : 12;

    const minutesStr = minutes < 10 ? "0" + minutes : minutes;

    return `${hours}:${minutesStr} ${ampm}`;
  } else if (diffDays === 1) {
    return "yesterday";
  } else {
    // If it was earlier, return the date
    const year = date.getUTCFullYear();
    const month = date.getUTCMonth() + 1; // getMonth() returns 0-11
    const day = date.getUTCDate();

    // Pad month and day with leading zero if necessary
    const monthStr = month < 10 ? "0" + month : month;
    const dayStr = day < 10 ? "0" + day : day;

    return `${year}-${monthStr}-${dayStr}`;
  }
};
