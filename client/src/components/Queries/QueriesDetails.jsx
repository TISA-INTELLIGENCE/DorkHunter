import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const QueryDetails = () => {
  const { query } = useParams();
  const navigate = useNavigate();

  const VITE_API_URL = import.meta.env.VITE_API_URL;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    const fetchQuery = async () => {
      try {
        const res = await fetch(`${VITE_API_URL}queries/${query}`);

        if (!res.ok) {
          throw new Error("Query not found");
        }

        const json = await res.json();
        setData(json.data);
      } catch (err) {
        setError(err.message || "Failed to load query");
      } finally {
        setLoading(false);
      }
    };

    fetchQuery();
  }, [query]);

  const handleDelete = async () => {
    setDeleting(true);
    setError("");

    try {
      const res = await fetch(`${VITE_API_URL}queries/${query}`, {
        method: "DELETE",
      });

      const json = await res.json();

      if (!res.ok || json.data?.deletedCount === 0) {
        throw new Error("Delete failed or query not found");
      }

      setShowConfirm(false);

      setTimeout(() => {
        navigate("/queries");
      }, 300);
    } catch (err) {
      setError(err.message);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center bg-white text-black px-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center">
          <h3 className="text-2xl font-semibold">Query Details</h3>
          <p className="text-sm text-gray-600">
            Details for selected dork query
          </p>
        </div>

        {/* State messages */}
        {loading && <p className="text-center text-sm">Loading…</p>}

        {error && <p className="text-center text-sm text-red-600">{error}</p>}

        {/* Content */}
        {data && (
          <>
            <div className="border border-gray-400 rounded px-4 py-3 space-y-2">
              <div>
                <span className="text-xs text-gray-500">Query</span>
                <p className="font-medium break-all">{data.query}</p>
              </div>

              <div>
                <span className="text-xs text-gray-500">Engine</span>
                <p>{data.engine}</p>
              </div>

              <div>
                <span className="text-xs text-gray-500">Created</span>
                <p className="text-sm">
                  {new Date(data.createdAt).toLocaleString()}
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowConfirm(true)}
              className="w-full border border-red-500 text-red-600 rounded px-3 py-2 font-medium hover:bg-red-50"
            >
              Delete Query
            </button>
          </>
        )}
      </div>

      {/* Confirm Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded w-96 shadow-lg">
            <h4 className="text-lg font-bold mb-3">Confirm Deletion</h4>

            <p className="mb-5 text-gray-700">
              Are you sure you want to delete this query? This action cannot be
              undone.
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>

              <button
                onClick={handleDelete}
                disabled={deleting}
                className="px-4 py-2 bg-red-600 text-white rounded disabled:opacity-50"
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QueryDetails;
