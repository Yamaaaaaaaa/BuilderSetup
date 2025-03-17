import PrivateRoute from "@/components/PrivateRoute/PrivateRoute";
import AdminLayout from "@/layouts/AdminLayout/AdminLayout";
import AdminDashboard from "@/pages/Admin/AdminDashBoard/AdminDashBoard";
import { Navigate } from "react-router-dom";
import {
  Route,
  Routes,
} from "react-router-dom";


const AdminRoutes = () => {
  return (
    <Routes>
      <Route
        path="/*"
        element={
          <PrivateRoute>
            <AdminLayout />
          </PrivateRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
      </Route>
      <Route path="*" element={<Navigate to="/admin" replace />} />
    </Routes>
  );
};

export default AdminRoutes;

