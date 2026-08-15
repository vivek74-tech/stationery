import { useState } from "react";
import { registerUser } from "../../services/auth.service";
import { useNavigate } from "react-router-dom";

function Register() {
  const [fullName, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("employee");
  const [isLoading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(!isLoading);
    try {
      const data = await registerUser({
        fullName,
        email,
        password,
        role,
      });

      console.log("Register Data:", data);

      navigate("/login");
    } catch (error) {
      console.log("Register Error:", error.response?.data);
    } finally {
      setLoading(!isLoading);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">

      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-md w-96"
      >
        <h2 className="text-3xl font-bold text-center mb-6">
          ERP Register
        </h2>

        <input
          type="text"
          placeholder="Full Name"
          className="w-full border p-3 rounded mb-4"
          value={fullName}
          onChange={(e) => setFullname(e.target.value)}
          required
        />

        <input
          type="email"
          placeholder="Email"
          className="w-full border p-3 rounded mb-4"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border p-3 rounded mb-4"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {/* Role */}
        <select
          className="w-full border p-3 rounded mb-6"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="employee">Employee</option>
          <option value="admin">Admin</option>
        </select>

        <button
          type="submit"
          className="bg-blue-600 text-white w-full py-3 rounded hover:bg-blue-700"
        >
          {isLoading?"Loading...":"Register"}
        </button>

        <p className="text-center mt-4 text-gray-600">
          Already have an account?{" "}

          <button
            type="button"
            onClick={() => navigate("/login")}
            className="text-blue-600 hover:underline"
          >
            Login
          </button>
        </p>

      </form>

    </div>
  );
}

export default Register;