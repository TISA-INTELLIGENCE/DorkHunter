import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

const Results = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchParams] = useSearchParams();
  const query = searchParams.get("q");

  useEffect(() => {
    if (!query) return;

    const fetchResults = async () => {
      try {
        const res = await fetch(
          `http://localhost:4000/api/v1/scans?q=${query}`
        );
        if (!res.ok) throw new Error("Failed to fetch results");
        const json = await res.json();
        setData(json); // <-- Fix here
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query]);

  if (loading) return <p>Loading results...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!data || !data.results || data.results.length === 0)
    return <p>No results found for "{query}"</p>;

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h3 className="text-xl font-semibold mb-4">Results for query: {query}</h3>
      <ul className="space-y-4">
        {data.results.map((result) => (
          <li
            key={result._id}
            className="p-4 border border-gray-300 rounded shadow-sm"
          >
            <a
              href={result.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold text-lg hover:underline"
            >
              {result.title}
            </a>
            <p className="text-gray-700 mt-2">{result.snippet}</p>
            <small className="text-gray-500">{result.link}</small>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Results;
