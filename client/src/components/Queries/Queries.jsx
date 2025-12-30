import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Queries = () => {
  const [queries, setQueries] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const VITE_API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetch(`${VITE_API_URL}queries`)
      .then((res) => {
        if (!res.ok) throw new Error("Response not OK");
        return res.json();
      })
      .then((data) => {
        setQueries(data.data);
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div className="flex flex-col items-center justify-center bg-white text-black px-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center">
          <h3 className="text-2xl font-semibold">Queries</h3>
          <p className="text-sm text-gray-600">
            Previously executed dork queries
          </p>
        </div>

        {/* Content */}
        {loading && <p className="text-center text-sm">Loading…</p>}
        {error && (
          <p className="text-center text-sm text-red-600">{error.message}</p>
        )}

        {!loading && !error && (
          <ul className="space-y-2">
            {queries.map((q) => (
              <li key={q._id}>
                <Link
                  to={`/queries/${q.query}`}
                  className="block border border-gray-400 rounded px-3 py-2 hover:bg-gray-100"
                >
                  <div className="font-medium">{q.query}</div>
                  <div className="text-xs text-gray-500">
                    Engine: {q.engine}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Queries;
