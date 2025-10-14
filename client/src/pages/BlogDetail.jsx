import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/axios";

export default function BlogDetail() {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;
    async function fetchBlog() {
      setLoading(true);
      setError("");
      try {
        const res = await api.get(`/blogs/${id}`);
        if (!isMounted) return;
        setBlog(res.data);
      } catch (e) {
        setError("Failed to load blog.");
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    if (id) fetchBlog();
    return () => {
      isMounted = false;
    };
  }, [id]);

  if (loading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;
  if (!blog) return <div className="p-6">Not found.</div>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <Link to="/blogs" className="text-indigo-600 underline">← Back to Blogs</Link>
      <h1 className="text-3xl font-bold mt-4 mb-2">{blog.title}</h1>
      <p className="text-gray-500 mb-4">{blog.author ? `By ${blog.author}` : null}</p>
      {blog.image ? (
        <img src={blog.image} alt={blog.title} className="w-full rounded mb-6" />
      ) : null}
      <div className="prose whitespace-pre-wrap">{blog.content}</div>
      {Array.isArray(blog.tags) && blog.tags.length > 0 && (
        <div className="mt-6">
          <span className="text-gray-600 mr-2">Tags:</span>
          {blog.tags.map((t) => (
            <span key={t} className="inline-block bg-gray-100 text-gray-700 text-sm px-2 py-1 rounded mr-2">
              {t}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}


