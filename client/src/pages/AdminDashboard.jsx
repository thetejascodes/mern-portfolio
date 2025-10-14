import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [counts, setCounts] = useState({ blogs: 0, projects: 0, contacts: 0 });

  useEffect(() => {
    let isMounted = true;
    async function fetchMetrics() {
      setLoading(true);
      setError("");
      try {
        const [blogsRes, projectsRes, contactsRes] = await Promise.all([
          api.get("/blogs"),
          api.get("/projects"),
          api.get("/contacts"),
        ]);
        if (!isMounted) return;
        const blogsCount = Array.isArray(blogsRes.data) ? blogsRes.data.length : (blogsRes.data?.data?.length || 0);
        const projectsCount = Array.isArray(projectsRes.data) ? projectsRes.data.length : (projectsRes.data?.data?.length || 0);
        const contactsCount = Array.isArray(contactsRes.data) ? contactsRes.data.length : (contactsRes.data?.data?.length || 0);
        setCounts({ blogs: blogsCount, projects: projectsCount, contacts: contactsCount });
      } catch (e) {
        setError("Failed to load metrics. Make sure you are logged in as admin.");
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    if (user) {
      fetchMetrics();
    }
    return () => {
      isMounted = false;
    };
  }, [user]);

  const chartData = useMemo(() => {
    return [
      { name: "Blogs", count: counts.blogs },
      { name: "Projects", count: counts.projects },
      { name: "Contacts", count: counts.contacts },
    ]; 
  }, [counts]);

  if (!user) return <p className="text-center mt-20">Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
          <p className="text-gray-500">Welcome back, <span className="font-semibold">{user.name}</span> 👋</p>
        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 text-red-700 p-4">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow p-6">
            <p className="text-gray-500">Total Blogs</p>
            <p className="text-3xl font-bold">{loading ? "-" : counts.blogs}</p>
          </div>
          <div className="bg-white rounded-xl shadow p-6">
            <p className="text-gray-500">Total Projects</p>
            <p className="text-3xl font-bold">{loading ? "-" : counts.projects}</p>
          </div>
          <div className="bg-white rounded-xl shadow p-6">
            <p className="text-gray-500">Contact Messages</p>
            <p className="text-3xl font-bold">{loading ? "-" : counts.contacts}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Overview</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#6366F1" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => navigate("/manage-blogs")}
            className="bg-blue-600 text-white rounded-xl py-3 font-semibold hover:bg-blue-700"
          >
            Manage Blogs
          </button>
          <button
            onClick={() => navigate("/manage-projects")}
            className="bg-green-600 text-white rounded-xl py-3 font-semibold hover:bg-green-700"
          >
            Manage Projects
          </button>
          <button
            onClick={() => navigate("/manage-contacts")}
            className="bg-yellow-500 text-white rounded-xl py-3 font-semibold hover:bg-yellow-600"
          >
            View Contact Messages
          </button>
        </div>

        <div className="mt-6">
          <button
            onClick={logout}
            className="bg-red-600 text-white rounded-xl px-5 py-2 font-semibold hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
