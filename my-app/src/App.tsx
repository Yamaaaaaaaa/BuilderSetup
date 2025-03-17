import {
  BrowserRouter as Router,
  Route,
  Routes,
} from "react-router-dom";
import ClientRoutes from "./routes/ClientRoutes";
import AdminRoutes from "./routes/AdminRoute";

function App() {
  return (
    <Router>
      <Routes>
        {/* <Route path="/" element={<Navigate to="/" replace />} /> */}
        <Route path="/*" element={<ClientRoutes/>} />
        <Route path="/admin/*" element={<AdminRoutes />} />
      </Routes>
    </Router>
  );
}

export default App;
