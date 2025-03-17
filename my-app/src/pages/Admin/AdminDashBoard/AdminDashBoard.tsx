const AdminDashboard = () => {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
        <p className="mb-4">Welcome to the admin dashboard. This is a placeholder for future admin functionality.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-2">Pages</h2>
            <p className="text-gray-600">Manage your website pages</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-2">Templates</h2>
            <p className="text-gray-600">Manage your website templates</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-2">Settings</h2>
            <p className="text-gray-600">Configure your website settings</p>
          </div>
        </div>
      </div>
    )
  }
  
  export default AdminDashboard
  
  