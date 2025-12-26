import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [query, setQuery] = useState("");
  const [isPending, setIsPending] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsPending(true);

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}?q=${encodeURIComponent(query)}`
      );

      if (!res.ok) throw new Error("Request failed");

      const data = await res.json();

      console.log(data);

      navigate("/results", { state: data });
    } catch (err) {
      console.error(err.message);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white text-black px-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center">
          <h3 className="text-2xl font-semibold">DorkHunter</h3>
          <p className="text-sm text-gray-600">
            simplify the whole process for dorking
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="site:example.com admin"
            required
            className="w-full border border-gray-400 rounded px-3 py-2 text-black placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-500"
          />

          <button
            type="submit"
            disabled={isPending}
            className="w-full border border-gray-400 rounded px-3 py-2 font-medium hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? "Searching..." : "Search"}
          </button>
        </form>

        {/* Footer */}
        <div className="text-sm text-gray-600 text-center">
          Your query: <code>{query || "—"}</code>
        </div>
      </div>
    </div>
  );
};

export default Home;
