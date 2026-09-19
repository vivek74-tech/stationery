import { useLocation } from "react-router-dom";

import Sidebar from "./components/layout/Sidebar";
import Navbar from "./components/layout/Navbar";
import AppRoutes from "./routes/AppRoutes";

function App() {
  const location = useLocation();

  const isAuthPage =
    location.pathname === "/login" ||
    location.pathname === "/register";

  // =====================================================
  // AUTH PAGES
  // =====================================================

  if (isAuthPage) {
    return <AppRoutes />;
  }

  // =====================================================
  // MAIN APPLICATION
  // =====================================================

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <div className="flex-1 min-h-screen bg-gray-100">
        <Navbar />

        <main className="p-6">
          <AppRoutes />
        </main>
      </div>
    </div>
  );
}

export default App;