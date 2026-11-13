import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const VITE_API_URL = import.meta.env.VITE_API_URL;

const Recon = () => {
  const navigate = useNavigate();
  const [domain, setDomain] = useState("");
  const [categories, setCategories] = useState([]);
  const [selected, setSelected] = useState(new Set());
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const res = await fetch(`${VITE_API_URL}recon/templates`);
        const data = await res.json();
        if (res.ok && data.success) {
          setCategories(data.data);
          setSelected(new Set(data.data.map((c) => c.key))); // all on by default
        }
      } catch {
        setError("Failed to load dork categories");
      }
    };
    fetchTemplates();
  }, []);

  const toggle = (key) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  };

  const totalDorks = categories
    .filter((c) => selected.has(c.key))
    .reduce((sum, c) => sum + c.dorkCount, 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!domain.trim() || selected.size === 0) return;

    setIsPending(true);
    setError(null);
    try {
      const res = await fetch(`${VITE_API_URL}recon`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          domain: domain.trim(),
          categories: Array.from(selected),
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Recon failed");
      }
      navigate(`/campaigns/${data.data._id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-semibold">Recon Campaign</h3>
        <p className="text-sm text-gray-600">
          Enter an in-scope target and pick recon angles. DorkHunter expands the
          dork templates, runs them, dedupes and severity-ranks the hits.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-1">
            Target domain
          </label>
          <input
            type="text"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            placeholder="example.com"
            required
            className="w-full border border-gray-400 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-gray-500"
          />
          <p className="text-xs text-gray-500 mt-1">
            Only test domains you are authorized to (a program's declared
            scope).
          </p>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Recon categories</span>
            <div className="text-xs text-gray-500 space-x-2">
              <button
                type="button"
                onClick={() =>
                  setSelected(new Set(categories.map((c) => c.key)))
                }
                className="hover:text-blue-600 underline"
              >
                All
              </button>
              <button
                type="button"
                onClick={() => setSelected(new Set())}
                className="hover:text-blue-600 underline"
              >
                None
              </button>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-2">
            {categories.map((c) => (
              <label
                key={c.key}
                className={`flex items-start gap-2 border rounded p-3 cursor-pointer transition ${
                  selected.has(c.key)
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-300 hover:border-gray-400"
                }`}
              >
                <input
                  type="checkbox"
                  checked={selected.has(c.key)}
                  onChange={() => toggle(c.key)}
                  className="mt-1"
                />
                <span>
                  <span className="block text-sm font-medium">
                    {c.label}{" "}
                    <span className="text-xs text-gray-400">
                      ({c.dorkCount})
                    </span>
                  </span>
                  <span className="block text-xs text-gray-500">
                    {c.description}
                  </span>
                </span>
              </label>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={isPending || !domain.trim() || selected.size === 0}
          className="w-full bg-blue-600 text-white rounded px-3 py-2 font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending
            ? `Running ${totalDorks} dorks…`
            : `Launch recon (${totalDorks} dorks)`}
        </button>

        {isPending && (
          <p className="text-xs text-center text-gray-500">
            This can take a while — each dork is a live search API call.
          </p>
        )}
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
      </form>
    </div>
  );
};

export default Recon;
