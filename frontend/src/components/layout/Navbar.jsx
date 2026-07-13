import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();

    toast.success("Logout Successfully");

    navigate("/login", {
      replace: true,
    });
  };

  return (
    <div className="h-16 bg-white shadow flex items-center justify-between px-6">

      <div>
        <h1 className="text-2xl font-bold text-gray-800">
          Stationery ERP
        </h1>

        <p className="text-sm text-gray-500">
          Welcome {user?.fullName || "Admin"}
        </p>
      </div>

      <button
        onClick={handleLogout}
        className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg transition"
      >
        Logout
      </button>

    </div>
  );
}

export default Navbar;