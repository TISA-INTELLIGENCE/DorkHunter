import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white text-black px-4">
      <div className="text-center space-y-4">
        <h3 className="text-3xl font-bold">404 - Not Found</h3>
        <p className="text-gray-700">
          Sorry, the page you were looking for does not exist.
        </p>
        <Link
          to="/"
          className="inline-block mt-2 px-4 py-2 border border-gray-400 rounded hover:bg-gray-100 font-medium text-black"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
