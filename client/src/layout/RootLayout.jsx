import { Link, Outlet } from "react-router-dom";

const RootLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white text-black">
      {/* Navigation */}
      <nav className="bg-gray-100 border-b border-gray-300 px-4 py-3">
        <ul className="flex space-x-4 justify-center">
          <li>
            <Link to="/" className="text-black font-medium hover:text-blue-600">
              Home
            </Link>
          </li>
          <li>
            <Link
              to="/recon"
              className="text-black font-medium hover:text-blue-600"
            >
              Recon
            </Link>
          </li>
          <li>
            <Link
              to="/campaigns"
              className="text-black font-medium hover:text-blue-600"
            >
              Campaigns
            </Link>
          </li>
          <li>
            <Link
              to="/results"
              className="text-black font-medium hover:text-blue-600"
            >
              Results
            </Link>
          </li>
          <li>
            <Link
              to="/queries"
              className="text-black font-medium hover:text-blue-600"
            >
              Queries
            </Link>
          </li>
          <li>
            <Link
              to="/scans"
              className="text-black font-medium hover:text-blue-600"
            >
              Scans
            </Link>
          </li>
        </ul>
      </nav>

      {/* Page Content */}
      <main className="flex-1 px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
};

export default RootLayout;
