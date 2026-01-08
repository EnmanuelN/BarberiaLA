import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import ProtectedRoute from "./lib/ProtectedRoute";


function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Landing pública */}
        <Route path="/" element={<HomePage />} />

        {/* Login barbero */}
        <Route path="/login" element={<AdminLogin />} />

        {/* Panel barbero */}
        <Route 
          path="/admin" 
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
          } 
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
