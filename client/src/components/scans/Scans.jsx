import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

const Scans = () => {
  const location = useLocation();
  const [scans, setScans] = useState(location.state || []);
  const [loading, setLoading] = useState(!location.state);
  const [error, setError] = useState("");

  const VITE_API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (scans.length > 0) return;

    const fetchScans = async () => {
      try {
        const res = await fetch(`${VITE_API_URL}scans/results`);
        const data = await res.json();

        if (res.ok && data.success) {
          setScans(data.data);
        } else {
          setError(data.message || "Failed to fetch scans");
        }
      } catch (err) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchScans();
  }, []);

  if (loading) return <p className="text-center mt-8">Loading scans...</p>;
  if (error) return <p className="text-center mt-8 text-red-500">{error}</p>;
  if (scans.length === 0)
    return <p className="text-center mt-8">No scans found.</p>;

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <h3 className="text-2xl font-bold mb-4">Scans</h3>

      {scans.map((scan) => (
        <div
          key={scan._id}
          className="mb-6 p-4 border rounded-lg shadow-sm hover:shadow-md transition"
        >
          <p className="text-sm text-gray-500 mb-2">
            Searched at: {new Date(scan.createdAt).toLocaleString()}
          </p>

          <Link
            to={`/scans/${scan._id}`}
            className="text-blue-600 font-bold hover:underline mb-2 block"
          >
            View Scan Details
          </Link>

          <div className="space-y-3">
            {scan.results.slice(0, 3).map((result) => (
              <div key={result._id} className="p-2 border-b last:border-b-0">
                <a
                  href={result.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline font-semibold"
                >
                  {result.title}
                </a>
                <p className="text-gray-700 text-sm mt-1">{result.snippet}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Scans;
