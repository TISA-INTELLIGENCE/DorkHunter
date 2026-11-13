// Shared severity + status constants for recon findings (no components here,
// so React Fast Refresh stays happy).

export const SEVERITY_STYLES = {
  critical: "bg-red-600 text-white",
  high: "bg-orange-500 text-white",
  medium: "bg-yellow-400 text-black",
  low: "bg-blue-200 text-blue-900",
  info: "bg-gray-200 text-gray-700",
};

export const STATUSES = ["new", "reviewing", "reported", "false-positive"];
