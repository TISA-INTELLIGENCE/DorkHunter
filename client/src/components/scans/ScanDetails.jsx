import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const ScanDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [scan, setScan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchScan = async () => {
      try {
        const res = await fetch(`http://localhost:4000/api/v1/scans/${id}`);
        const data = await res.json();

        if (res.ok && data.success) {
          setScan(data.data);
        } else {
          setError(data.message || "Failed to fetch scan details");
        }
      } catch (err) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchScan();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this scan?")) return;

    setDeleting(true);

    try {
      const res = await fetch(`http://localhost:4000/api/v1/scans/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to delete scan");

      alert("Scan deleted successfully!");
      navigate("/scans"); // go back to scans list
    } catch (err) {
      alert(err.message);
    } finally {
      setDeleting(false);
    }
  };

  if (loading)
    return <p className="text-center mt-8">Loading scan details...</p>;
  if (error) return <p className="text-center mt-8 text-red-500">{error}</p>;
  if (!scan) return <p className="text-center mt-8">Scan not found.</p>;

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h3 className="text-2xl font-bold mb-4">Scan Details</h3>
      <p className="text-gray-500 mb-2">
        Created at: {new Date(scan.createdAt).toLocaleString()}
      </p>

      <button
        onClick={handleDelete}
        disabled={deleting}
        className="mb-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {deleting ? "Deleting..." : "Delete Scan"}
      </button>

      <h4 className="text-xl font-semibold mb-2">Results:</h4>
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
            <small className="text-gray-500">{result.link}</small>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ScanDetails;
