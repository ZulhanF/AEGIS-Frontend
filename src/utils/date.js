// Utils untuk format tanggal dan waktu
export function formatDate(date, options = {}) {
  if (!date) return "N/A";

  const defaultOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
    ...options,
  };

  return new Date(date).toLocaleDateString("en-US", defaultOptions);
}

export function formatDateTime(date) {
  if (!date) return "N/A";

  return new Date(date).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function getRelativeTime(date) {
  if (!date) return "N/A";

  const now = new Date();
  const past = new Date(date);
  const diffInSeconds = Math.floor((now - past) / 1000);

  if (diffInSeconds < 60) return "Just now";
  if (diffInSeconds < 3600)
    return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400)
    return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 604800)
    return `${Math.floor(diffInSeconds / 86400)} days ago`;
  if (diffInSeconds < 2592000)
    return `${Math.floor(diffInSeconds / 604800)} weeks ago`;
  if (diffInSeconds < 31536000)
    return `${Math.floor(diffInSeconds / 2592000)} months ago`;
  return `${Math.floor(diffInSeconds / 31536000)} years ago`;
}

export function isDateInRange(date, startDate, endDate) {
  if (!date) return false;

  const target = new Date(date);
  const start = startDate ? new Date(startDate) : null;
  const end = endDate ? new Date(endDate) : null;

  if (start && target < start) return false;
  if (end && target > end) return false;

  return true;
}

export function getDateRangePresets() {
  const now = new Date();

  return {
    today: {
      label: "Today",
      start: new Date(now.setHours(0, 0, 0, 0)),
      end: new Date(now.setHours(23, 59, 59, 999)),
    },
    last7days: {
      label: "Last 7 Days",
      start: new Date(now.setDate(now.getDate() - 7)),
      end: new Date(),
    },
    last30days: {
      label: "Last 30 Days",
      start: new Date(now.setDate(now.getDate() - 30)),
      end: new Date(),
    },
    last90days: {
      label: "Last 90 Days",
      start: new Date(now.setDate(now.getDate() - 90)),
      end: new Date(),
    },
    thisMonth: {
      label: "This Month",
      start: new Date(now.getFullYear(), now.getMonth(), 1),
      end: new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59),
    },
    lastMonth: {
      label: "Last Month",
      start: new Date(now.getFullYear(), now.getMonth() - 1, 1),
      end: new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59),
    },
  };
}

export function daysBetween(date1, date2) {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  const diffTime = Math.abs(d2 - d1);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

export function hoursBetween(date1, date2) {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  const diffTime = Math.abs(d2 - d1);
  return Math.floor(diffTime / (1000 * 60 * 60));
}
