import { useState } from "react";
import { loginUser } from "../../services/auth.service";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

function Login() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading , setLoading]=useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(!isLoading);
    try {
      const data = await loginUser({
        email,
        password,
      });

      login(data.data);

      // console.log("Actual Auth Data:", data.data.message);

      toast.success(data.message);

      navigate("/");

    } catch (error) {
      console.log(error.response?.data);

      toast.error(
        error.response?.data?.message || "Login failed"
      );
    }  finally{
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
          ERP Login
        </h2>

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
          className="w-full border p-3 rounded mb-6"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        
       <button
          type="submit"
          className="bg-blue-600 text-white w-full py-3 rounded hover:bg-blue-700"
        >{
         isLoading?'Loading...':" Login"
        }
          
        </button>


        

       

        <p className="text-center mt-4 text-gray-600">
          Don't have an account?{" "}

          <button
            type="button"
            onClick={() => navigate("/register")}
            className="text-blue-600 hover:underline"
          >
            Register
          </button>
        </p>

      </form>

    </div>
  );
}

export default Login;