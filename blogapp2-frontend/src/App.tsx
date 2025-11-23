import { Routes, Route, Link, useNavigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import { CgProfile } from "react-icons/cg";
import { FiLogIn, FiLogOut } from "react-icons/fi";
import { GrHomeRounded } from "react-icons/gr";
import { useAuth } from "./contexts/AuthContext";
import Register from "./pages/Register";

import Profile from "./pages/Profile";

function App() {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="bg-black text-gray-100 min-h-screen">
      <div className="flex justify-center">
        <div className="w-20 p-4 flex flex-col items-start gap-6 sticky top-0 h-screen">
          {/* Side Nav Icons */}
          <Link to="/home" className="p-2 rounded-full">
            <GrHomeRounded size={28} />
          </Link>
          <Link to="/profile" className="p-2 rounded-full">
            <CgProfile size={28} />
          </Link>
          {isAuthenticated ? (
            <button
              onClick={handleLogout}
              className="p-2 rounded-full hover:bg-gray-800 transition-colors"
              title="Log out"
            >
              <FiLogOut size={28} />
            </button>
          ) : (
            <Link to="/login" className="p-2 rounded-full">
              <FiLogIn size={28} />
            </Link>
          )}
        </div>
        <div className="max-w-3xl w-full border-l border-r border-gray-800 min-h-screen">
          <Routes>
            <Route index element={<Home />} />
            <Route path="home" element={<Home />} />
            <Route path="profile" element={<Profile />} />
            <Route path="profile/:userId" element={<Profile />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
          </Routes>
        </div>
        <div className="w-20 p-4">{/* this is a spacer */}</div>
      </div>
    </div>
  );
}

export default App;
