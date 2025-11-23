import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FiUserPlus, FiEye, FiEyeOff } from "react-icons/fi";
import { AuthService } from "../services/authservice";

const Register = () => {
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await AuthService.register({ userName, email, password });
      // On success, redirect to login
      navigate("/login");
    } catch (err: any) {
      setError("registration failed. please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = userName.length >= 3 && email.includes("@") && password.length >= 6;

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
            <FiUserPlus size={24} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">create account</h1>
          <p className="text-gray-400">join the community today</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* username field */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              username
            </label>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-colors"
              placeholder="choose a username"
              required
              minLength={3}
              maxLength={15}
            />
          </div>

          {/* email field */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-colors"
              placeholder="enter your email"
              required
            />
          </div>

          {/* password field */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-colors pr-12"
                placeholder="create a password"
                required
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors"
              >
                {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
              </button>
            </div>
            <p className="mt-1 text-xs text-gray-500">
              must be at least 6 characters
            </p>
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
                creating account...
              </div>
            ) : (
              "sign up"
            )}
          </button>
        </form>

        {/* login link */}
        <div className="mt-6 text-center">
          <p className="text-gray-400 text-sm">
            already have an account?{" "}
            <Link to="/login" className="text-blue-400 hover:text-blue-300 transition-colors">
              log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;