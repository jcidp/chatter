interface formatTimestampParams {
  timeOnly?: boolean;
  dateOnly?: boolean;
}

export function formatTimestamp(
  timestamp: string,
  { timeOnly, dateOnly }: formatTimestampParams = {},
) {
  const date = new Date(timestamp);

  const timestampDate = getTimestampDate(timestamp);
  const nowDate = getTimestampDate();

  const diffDays = Math.floor(
    (nowDate.getTime() - timestampDate.getTime()) / (1000 * 60 * 60 * 24),
  );

  if (timeOnly || diffDays === 0) {
    if (dateOnly) return "Today";
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    hours %= 12;
    hours = hours ? hours : 12;

    const minutesStr = minutes < 10 ? "0" + minutes : minutes;

    return `${hours}:${minutesStr} ${ampm}`;
  } else if (diffDays === 1) {
    return "Yesterday";
  } else {
    // If it was earlier, return the date
    const year = date.getFullYear();
    const month = date.getMonth() + 1; // getMonth() returns 0-11
    const day = date.getDate();

    // Pad month and day with leading zero if necessary
    const monthStr = month < 10 ? "0" + month : month;
    const dayStr = day < 10 ? "0" + day : day;

    return `${year}-${monthStr}-${dayStr}`;
  }
}

export function isDateEqual(timestamp1: string, timestamp2: string) {
  const date1 = getTimestampDate(timestamp1);
  const date2 = getTimestampDate(timestamp2);

  return date1.getTime() === date2.getTime();
}

function getTimestampDate(ts: string | null = null) {
  const date = ts ? new Date(ts) : new Date();
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}
