import { useLocation, useNavigate } from "react-router-dom";

const Results = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const data = location.state;

  if (!data) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <p className="mb-4 text-gray-600">
          No results found or page refreshed.
        </p>
        <button
          onClick={() => navigate("/")}
          className="border border-gray-400 px-4 py-2 rounded hover:bg-gray-100"
        >
          Go Back Home
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-black p-8">
      <div className="max-w-4xl mx-auto">
        <header className="flex justify-between items-center mb-8 border-b pb-4">
          <h1 className="text-2xl font-bold">DorkHunter Results</h1>
          <button
            onClick={() => navigate("/")}
            className="text-sm text-gray-500 hover:underline"
          >
            ← New Search
          </button>
        </header>

        <div className="space-y-6">
          {data.results && data.results.length > 0 ? (
            data.results.map((item, index) => (
              <div key={index} className="border p-4 rounded shadow-sm">
                <h2 className="text-blue-600 hover:underline font-medium">
                  <a href={item.link} target="_blank" rel="noreferrer">
                    {item.title}
                  </a>
                </h2>
                <p className="text-green-700 text-sm">{item.displayLink}</p>
                <p className="text-gray-600 text-sm mt-1">{item.snippet}</p>
              </div>
            ))
          ) : (
            <p>No matches found for that dork.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Results;
