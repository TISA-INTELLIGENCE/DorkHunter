import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const VITE_API_URL = import.meta.env.VITE_API_URL;

const SEV_ORDER = ["critical", "high", "medium", "low", "info"];
const SEV_DOT = {
  critical: "text-red-600",
  high: "text-orange-500",
  medium: "text-yellow-500",
  low: "text-blue-500",
  info: "text-gray-400",
};

const Campaigns = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const res = await fetch(`${VITE_API_URL}recon`);
        const data = await res.json();
        if (res.ok && data.success) {
          setCampaigns(data.data);
        } else {
          setError(data.message || "No campaigns yet");
        }
      } catch (err) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };
    fetchCampaigns();
  }, []);

  if (loading) return <p className="text-center mt-8">Loading campaigns…</p>;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-2xl font-bold">Campaigns</h3>
        <Link
          to="/recon"
          className="bg-blue-600 text-white text-sm rounded px-3 py-2 hover:bg-blue-700"
        >
          + New campaign
        </Link>
      </div>

      {error && campaigns.length === 0 ? (
        <p className="text-center mt-8 text-gray-500">{error}</p>
      ) : (
        <div className="space-y-3">
          {campaigns.map((c) => (
            <Link
              key={c._id}
              to={`/campaigns/${c._id}`}
              className="block border rounded-lg p-4 hover:shadow-md transition"
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold text-lg">{c.domain}</span>
                <span className="text-xs text-gray-500">
                  {new Date(c.createdAt).toLocaleString()}
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                {c.stats?.totalFindings ?? 0} findings from{" "}
                {c.stats?.dorksRun ?? 0} dorks
              </p>
              <div className="flex gap-3 mt-2 text-xs">
                {SEV_ORDER.map((s) => (
                  <span key={s} className={SEV_DOT[s]}>
                    ● {s}: {c.stats?.bySeverity?.[s] ?? 0}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Campaigns;
