import React from "react";

const Results = ({ data }) => {
  if (!data || !data.results || data.results.length === 0) {
    return (
      <div>
        <h3>No results found for this query.</h3>
      </div>
    );
  }

  return (
    <div>
      <h3>Results for query: {data.query}</h3>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {data.results.map((result) => (
          <li
            key={result._id}
            style={{
              marginBottom: "1.5rem",
              padding: "1rem",
              border: "1px solid #ddd",
              borderRadius: "8px",
            }}
          >
            <a
              href={result.link}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontSize: "1.1rem",
                fontWeight: "bold",
                color: "#1a0dab",
              }}
            >
              {result.title}
            </a>
            <p style={{ margin: "0.5rem 0", color: "#4d5156" }}>
              {result.snippet}
            </p>
            <small style={{ color: "#555" }}>{result.link}</small>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Results;
