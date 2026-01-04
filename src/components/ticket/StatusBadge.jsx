// Ini buat badge dengan kustomisasi warna yg disesuaikan
export function StatusBadge({ status }) {
  const StatusColor = (status) => {
    const statusMap = {
      open: "text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-950",
      "in_progress":
        "text-purple-600 bg-purple-100 dark:text-purple-400 dark:bg-purple-950",
      resolved:
        "text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-950",
    };
    const key = status?.toLowerCase();
    return statusMap[key] || "text-gray-600 bg-gray-100";
  };
  return (
    <div
      className={`capitalize px-2 py-1 rounded-md text-xs font-medium inline-block ${StatusColor(
        status
      )}`}
    >
      {status?.replace("_", " ")}
    </div>
  );
}

export function PriorityBadge({ priority }) {
  const PriorityColor = (priority) => {
    const priorityMap = {
      high: "text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-950",
      medium:
        "text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-950",
      low: "text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-950",
    };
    const key = priority?.toLowerCase();
    return priorityMap[key] || "text-gray-600 bg-gray-100";
  };
  return (
    <div
      className={`capitalize px-2 py-1 rounded-md text-xs font-medium inline-block ${PriorityColor(
        priority
      )}`}
    >
      {priority}
    </div>
  );
}
