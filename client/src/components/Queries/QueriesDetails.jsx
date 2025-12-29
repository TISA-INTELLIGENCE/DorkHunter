import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const QueryDetails = () => {
  const { query } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetch(`http://localhost:4000/api/v1/queries/${query}`)
      .then((res) => {
        if (!res.ok) throw new Error("Query not found");
        return res.json();
      })
      .then((json) => {
        setData(json.data);
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [query]);

  const handleDelete = async () => {
    const confirm = window.confirm(
      "Are you sure you want to delete this query?"
    );
    if (!confirm) return;

    setDeleting(true);
    setError(null);

    try {
      const res = await fetch(`http://localhost:4000/api/v1/queries/${query}`, {
        method: "DELETE",
      });

      const json = await res.json();

      // Backend flaw handling
      if (!res.ok || json.data?.deletedCount === 0) {
        throw new Error("Delete failed or query not found");
      }

      // Redirect back to list
      navigate("/queries");
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

        {/* Content */}
        {loading && <p className="text-center text-sm">Loading…</p>}

        {error && <p className="text-center text-sm text-red-600">{error}</p>}

        {data && (
          <>
            <div className="border border-gray-400 rounded px-4 py-3 space-y-2">
              <div>
                <span className="text-xs text-gray-500">Query</span>
                <p className="font-medium">{data.query}</p>
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

            {/* Delete Button */}
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="w-full border border-red-500 text-red-600 rounded px-3 py-2 font-medium hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {deleting ? "Deleting..." : "Delete Query"}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default QueryDetails;
