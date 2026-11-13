import { SEVERITY_STYLES } from "./severityConstants";

export const SeverityBadge = ({ severity }) => (
  <span
    className={`inline-block text-xs font-semibold uppercase px-2 py-0.5 rounded ${
      SEVERITY_STYLES[severity] || SEVERITY_STYLES.info
    }`}
  >
    {severity}
  </span>
);
