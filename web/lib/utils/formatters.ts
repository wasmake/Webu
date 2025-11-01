export function formatBytes(bytes?: number, decimals = 1) {
  if (!bytes) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const formatted = parseFloat((bytes / Math.pow(k, i)).toFixed(decimals));
  return `${formatted} ${sizes[i]}`;
}

export function formatDuration(seconds?: number) {
  if (typeof seconds !== "number") return "--:--";
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
    .toString()
    .padStart(2, "0")}`;
}

export function formatTimecode(seconds: number) {
  const minutes = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const secs = Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0");
  return `${minutes}:${secs}`;
}

export function formatRelativeDate(date: string | Date) {
  const formatter = new Intl.RelativeTimeFormat("es", { numeric: "auto" });
  const now = new Date();
  const value = typeof date === "string" ? new Date(date) : date;
  const diff = value.getTime() - now.getTime();
  const diffMinutes = Math.round(diff / (1000 * 60));
  const diffHours = Math.round(diff / (1000 * 60 * 60));
  const diffDays = Math.round(diff / (1000 * 60 * 60 * 24));

  if (Math.abs(diffMinutes) < 60) {
    return formatter.format(diffMinutes, "minute");
  }
  if (Math.abs(diffHours) < 24) {
    return formatter.format(diffHours, "hour");
  }
  return formatter.format(diffDays, "day");
}
