import { useLocation } from "react-router-dom";

import Sidebar from "./components/layout/Sidebar";
import Navbar from "./components/layout/Navbar";
import AppRoutes from "./routes/AppRoutes";

function App() {
  const location = useLocation();

  const isLoginPage = location.pathname === "/login";

  return (
    <>
      {isLoginPage ? (
        <AppRoutes />
      ) : (
        <div className="flex">
          <Sidebar />

          <div className="flex-1 bg-gray-100 min-h-screen">
            <Navbar />

            <div className="p-6">
              <AppRoutes />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default App;