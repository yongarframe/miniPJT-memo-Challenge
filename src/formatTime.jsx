export function formatTime(second) {
  const timeString = `${String(Math.floor(second / 3600)).padStart(
    2,
    "0"
  )}:${String(Math.floor((second % 3600) / 60)).padStart(2, "0")}:${String(
    second % 60
  ).padStart(2, "0")}`;

  return timeString;
}
