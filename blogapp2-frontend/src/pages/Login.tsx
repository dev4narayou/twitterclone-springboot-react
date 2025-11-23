import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FiEye, FiEyeOff, FiLogIn } from "react-icons/fi";
import { AuthService } from "../services/authservice";
import { useAuth } from "../contexts/AuthContext";


interface LoginFormData {
  usernameOrEmail: string;
  password: string;
}

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState<LoginFormData>({
    usernameOrEmail: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // clear error when user starts typing
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      console.log("Attempting login with:", formData);
      const response = await AuthService.login(formData);
      console.log("Login response:", response);
      console.log("Token:", response.accessToken);
      console.log("User data from response:", {
        id: response.id,
        username: response.username,
        email: response.email,
      });

      // extract user data from response
      const userData = {
        id: response.id,
        username: response.username,
        email: response.email,
      };

      // use the auth context to update authentication state
      login(response.accessToken, userData);

      // redirect to home
      navigate("/home");
    } catch (error) {
      console.error("login failed:", error);
      setError("invalid username or password. please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  const isFormValid =
    formData.usernameOrEmail.trim() && formData.password.trim();

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
            <FiLogIn size={24} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">welcome back</h1>
          <p className="text-gray-400">sign in to your account</p>
        </div>

        {/* login form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* email or username field */}
          <div>
            <label
              htmlFor="usernameOrEmail"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              email or username
            </label>
            <input
              type="text"
              id="usernameOrEmail"
              name="usernameOrEmail"
              value={formData.usernameOrEmail}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-colors"
              placeholder="enter your email or username"
              required
            />
          </div>

          {/* password field */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-colors pr-12"
                placeholder="enter your password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors"
              >
                {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
              </button>
            </div>
          </div>

          {/* error message */}
          {error && (
            <div className="bg-red-900/50 border border-red-700 rounded-lg p-3">
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          )}

          {/* submit button */}
          <button
            type="submit"
            disabled={!isFormValid || isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 focus:ring-offset-black"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                signing in...
              </div>
            ) : (
              "sign in"
            )}
          </button>
        </form>

        {/* additional options */}
        <div className="mt-6 text-center">
          <p className="text-gray-400 text-sm">
            don't have an account?{" "}
            <Link to="/register" className="text-blue-400 hover:text-blue-300 transition-colors">
              create one
            </Link>
          </p>
        </div>

        {/* demo credentials info */}
        <div className="mt-6 p-4 bg-gray-900/50 border border-gray-700 rounded-lg">
          <p className="text-gray-300 text-sm font-medium mb-2">
            demo credentials:
          </p>
          <div className="text-gray-400 text-xs space-y-1">
            <p>
              email: <span className="text-gray-300">test@test.com</span>
            </p>
            <p>
              password: <span className="text-gray-300">password</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
