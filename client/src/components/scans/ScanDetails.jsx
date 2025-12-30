import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const ScanDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const VITE_API_URL = import.meta.env.VITE_API_URL;

  const [scan, setScan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    const fetchScan = async () => {
      try {
        const res = await fetch(`${VITE_API_URL}scans/${id}`);
        const data = await res.json();

        if (!res.ok || !data.success) {
          throw new Error(data.message || "Failed to fetch scan");
        }

        setScan(data.data);
      } catch (err) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchScan();
  }, [id]);

  const handleDelete = async () => {
    setDeleting(true);
    setError("");

    try {
      const res = await fetch(`${VITE_API_URL}scans/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to delete scan");
      }

      setSuccess("Scan deleted successfully");
      setShowConfirm(false);

      setTimeout(() => {
        navigate("/scans");
      }, 1000);
    } catch (err) {
      setError(err.message);
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return <p className="text-center mt-8">Loading scan details...</p>;
  }

  if (error && !scan) {
    return <p className="text-center mt-8 text-red-500">{error}</p>;
  }

  if (!scan) {
    return <p className="text-center mt-8">Scan not found.</p>;
  }

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h3 className="text-2xl font-bold mb-2">Scan Details</h3>

      <p className="text-gray-500 mb-4">
        Searched at: {new Date(scan.createdAt).toLocaleString()}
      </p>

      {success && (
        <p className="mb-4 text-green-600 font-semibold">{success}</p>
      )}

      {error && <p className="mb-4 text-red-600 font-semibold">{error}</p>}

      <button
        onClick={() => setShowConfirm(true)}
        className="mb-6 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
      >
        Delete Scan
      </button>

      <h4 className="text-xl font-semibold mb-3">Results</h4>

      <ul className="space-y-4">
        {scan.results.map((result) => (
          <li key={result._id} className="p-3 border rounded">
            <a
              href={result.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline"
            >
              {result.title}
            </a>

            <p className="text-gray-700 mt-1">{result.snippet}</p>

            <small className="text-gray-500 block mt-1">{result.link}</small>
          </li>
        ))}
      </ul>

      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded w-96 shadow-lg">
            <h4 className="text-lg font-bold mb-3">Confirm Deletion</h4>

            <p className="mb-5 text-gray-700">
              Are you sure you want to delete this scan? This action cannot be
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

export default ScanDetails;
