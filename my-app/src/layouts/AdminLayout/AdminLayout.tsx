import { Outlet } from "react-router-dom"
import { Link } from "react-router-dom"

const AdminLayout = () => {
  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <div className="w-64 bg-gray-900 text-white">
        <div className="p-4">
          <h1 className="text-xl font-bold">Admin Panel</h1>
        </div>
        <nav className="mt-6">
          <ul>
            <li>
              <Link to="/admin" className="block py-2 px-4 hover:bg-gray-800">
                Dashboard
              </Link>
            </li>
            <li>
              <Link to="/" className="block py-2 px-4 hover:bg-gray-800">
                Back to Site
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 bg-gray-100">
        <header className="bg-white shadow-md p-4">
          <h2 className="text-xl font-semibold">Admin Dashboard</h2>
        </header>
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default AdminLayout

