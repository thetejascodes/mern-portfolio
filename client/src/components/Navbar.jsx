import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-gray-800 p-4 text-white flex justify-between">
      <h1 className="text-xl font-bold">My Portfolio</h1>
      <div className="space-x-4">
        <Link to="/">Home</Link>
        <Link to="/projects">Projects</Link>
        <Link to="/contact">Contact</Link>
      </div>
    </nav>
  );
}
