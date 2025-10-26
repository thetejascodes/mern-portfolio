import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-gray-800 p-4 text-white flex justify-between">
      <h1 className="text-xl font-bold">My Portfolio</h1>
      <div className="space-x-4">
        <Link to="/">Home</Link>
        <Link to="/projects">Projects</Link>
        <Link to="/contact">Contact</Link>
        <Link to="/blogs">Blogs</Link>
        {!user && <Link to="/login">Login</Link>}
        {user && user.role === "admin" && (
          <Link to="/admin" className="font-semibold underline">
            Admin Dashboard
          </Link>
        )}
        {user && (
          <button onClick={logout} className="hover:text-gray-300">
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}
