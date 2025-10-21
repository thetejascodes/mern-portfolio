import { useEffect, useState } from "react";
import api from "../api/axios";

export default function ManageBlogs() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedBlog, setSelectedBlog] = useState(null);
  const [viewLoading, setViewLoading] = useState(false);
  const [viewError, setViewError] = useState("");

  const [form, setForm] = useState({
    _id: null,
    title: "",
    content: "",
    image: "",
    author: "",
    tags: "",
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const resetForm = () => {
    setForm({ _id: null, title: "", content: "", image: "", author: "", tags: "" });
    setSelectedFile(null);
  };

  async function fetchBlogs() {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/blogs");
      setBlogs(Array.isArray(res.data) ? res.data : []);
    } catch (e) {
      setError("Failed to load blogs.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append('title', form.title);
      formData.append('content', form.content);
      formData.append('author', form.author || '');
      formData.append('tags', form.tags ? form.tags.split(",").map((t) => t.trim()).filter(Boolean).join(',') : '');
      
      if (selectedFile) {
        formData.append('image', selectedFile);
      } else if (form.image) {
        formData.append('image', form.image);
      }

      if (form._id) {
        await api.put(`/blogs/${form._id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      } else {
        await api.post("/blogs", formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      }
      await fetchBlogs();
      resetForm();
    } catch (e) {
      setError("Failed to save blog.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (blog) => {
    setForm({
      _id: blog._id,
      title: blog.title || "",
      content: blog.content || "",
      image: blog.image || "",
      author: blog.author || "",
      tags: Array.isArray(blog.tags) ? blog.tags.join(", ") : blog.tags || "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this blog?")) return;
    setError("");
    try {
      await api.delete(`/blogs/${id}`);
      setBlogs((prev) => prev.filter((b) => b._id !== id));
      if (form._id === id) resetForm();
    } catch (e) {
      setError("Failed to delete blog.");
    }
  };

  const handleView = async (id) => {
    setViewLoading(true);
    setViewError("");
    setSelectedBlog(null);
    try {
      const res = await api.get(`/blogs/${id}`);
      setSelectedBlog(res.data);
    } catch (e) {
      setViewError("Failed to load blog details.");
    } finally {
      setViewLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-6">Manage Blogs</h1>

        {error && <div className="mb-4 bg-red-50 text-red-700 p-3 rounded">{error}</div>}

        <div className="bg-white rounded-xl shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">{form._id ? "Edit Blog" : "Create Blog"}</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              placeholder="Title"
              className="border rounded p-2"
            />
            <textarea
              name="content"
              value={form.content}
              onChange={handleChange}
              required
              placeholder="Content"
              className="border rounded p-2 h-32"
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Blog Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="border rounded p-2 w-full"
              />
              {selectedFile && (
                <div className="mt-2">
                  <p className="text-sm text-green-600 mb-2">
                    Selected: {selectedFile.name}
                  </p>
                  <img 
                    src={URL.createObjectURL(selectedFile)} 
                    alt="Preview" 
                    className="w-full h-48 object-cover rounded-lg border"
                  />
                </div>
              )}
              <p className="text-sm text-gray-500 mt-1">
                Or enter image URL:
              </p>
              <input
                name="image"
                value={form.image}
                onChange={handleChange}
                placeholder="Image URL (optional)"
                className="border rounded p-2 mt-1 w-full"
              />
              {form.image && !selectedFile && (
                <div className="mt-2">
                  <p className="text-sm text-blue-600 mb-2">URL Image Preview:</p>
                  <img 
                    src={form.image} 
                    alt="URL Preview" 
                    className="w-full h-48 object-cover rounded-lg border"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'block';
                    }}
                  />
                  <p className="text-sm text-red-500 hidden">Failed to load image</p>
                </div>
              )}
            </div>
            <input
              name="author"
              value={form.author}
              onChange={handleChange}
              placeholder="Author (optional)"
              className="border rounded p-2"
            />
            <input
              name="tags"
              value={form.tags}
              onChange={handleChange}
              placeholder="Tags (comma separated)"
              className="border rounded p-2"
            />

            <div className="flex items-center gap-3">
              <button
                type="submit"
                disabled={submitting}
                className="bg-indigo-600 text-white rounded px-4 py-2 disabled:opacity-60"
              >
                {form._id ? (submitting ? "Updating..." : "Update") : (submitting ? "Creating..." : "Create")}
              </button>
              {form._id && (
                <button type="button" onClick={resetForm} className="px-4 py-2 border rounded">
                  Cancel Edit
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-semibold mb-4">All Blogs</h2>
          {selectedBlog && (
            <div className="mb-6 border rounded-lg p-4 bg-gray-50">
              <div className="flex items-start justify-between">
                <h3 className="text-lg font-semibold">Preview</h3>
                <button onClick={() => setSelectedBlog(null)} className="text-sm underline">Close</button>
              </div>
              {viewError && (
                <div className="mt-2 bg-red-50 text-red-700 p-2 rounded">{viewError}</div>
              )}
              {viewLoading ? (
                <p className="mt-2">Loading...</p>
              ) : (
                <div className="mt-3">
                  <h4 className="text-2xl font-bold mb-1">{selectedBlog.title}</h4>
                  <p className="text-gray-500 mb-3">{selectedBlog.author ? `By ${selectedBlog.author}` : null}</p>
                  {selectedBlog.image ? (
                    <div>
                      <p className="text-sm text-gray-500 mb-2">
                        Debug - Image path: {selectedBlog.image}
                      </p>
                      <p className="text-sm text-gray-500 mb-2">
                        Debug - Full URL: {selectedBlog.image.startsWith('http') ? selectedBlog.image : `http://localhost:5000${selectedBlog.image}`}
                      </p>
                      <img 
                        src={selectedBlog.image.startsWith('http') ? selectedBlog.image : `http://localhost:5000${selectedBlog.image}`} 
                        alt={selectedBlog.title} 
                        className="w-full rounded mb-4" 
                        onError={(e) => {
                          console.error('Image failed to load:', e.target.src);
                          console.error('Error details:', e);
                          console.error('Trying alternative URL...');
                          // Try alternative URL construction
                          const altUrl = selectedBlog.image.startsWith('/') ? `http://localhost:5000${selectedBlog.image}` : `http://localhost:5000/${selectedBlog.image}`;
                          console.log('Alternative URL:', altUrl);
                          e.target.src = altUrl;
                        }}
                        onLoad={() => {
                          console.log('Image loaded successfully:', selectedBlog.image);
                        }}
                      />
                      <p className="text-sm text-red-500 hidden">Failed to load image</p>
                    </div>
                  ) : null}
                  <div className="whitespace-pre-wrap">{selectedBlog.content}</div>
                  {Array.isArray(selectedBlog.tags) && selectedBlog.tags.length > 0 && (
                    <div className="mt-4">
                      <span className="text-gray-600 mr-2">Tags:</span>
                      {selectedBlog.tags.map((t) => (
                        <span key={t} className="inline-block bg-gray-100 text-gray-700 text-sm px-2 py-1 rounded mr-2">
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
          {loading ? (
            <p>Loading...</p>
          ) : blogs.length === 0 ? (
            <p>No blogs yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="text-left border-b">
                    <th className="py-2 pr-4">Title</th>
                    <th className="py-2 pr-4">Author</th>
                    <th className="py-2 pr-4">Tags</th>
                    <th className="py-2 pr-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {blogs.map((b) => (
                    <tr key={b._id} className="border-b">
                      <td className="py-2 pr-4">{b.title}</td>
                      <td className="py-2 pr-4">{b.author || "-"}</td>
                      <td className="py-2 pr-4">{Array.isArray(b.tags) ? b.tags.join(", ") : "-"}</td>
                      <td className="py-2 pr-4 flex gap-2">
                        <button onClick={() => handleView(b._id)} className="px-3 py-1 border rounded">
                          View
                        </button>
                        <button onClick={() => handleEdit(b)} className="px-3 py-1 border rounded">
                          Edit
                        </button>
                        <button onClick={() => handleDelete(b._id)} className="px-3 py-1 border rounded text-red-600">
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


