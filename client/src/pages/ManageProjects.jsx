import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function ManageProjects() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedProject, setSelectedProject] = useState(null);
  const [viewLoading, setViewLoading] = useState(false);
  const [viewError, setViewError] = useState("");

  const [form, setForm] = useState({
    _id: null,
    title: "",
    description: "",
    techStack: "",
    githubLink: "",
    liveLink: "",
    imageUrl: "",
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const resetForm = () => {
    setForm({ _id: null, title: "", description: "", techStack: "", githubLink: "", liveLink: "", imageUrl: "" });
    setSelectedFile(null);
  };

  async function fetchProjects() {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/projects");
      setProjects(Array.isArray(res.data) ? res.data : []);
    } catch (e) {
      setError("Failed to load projects.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProjects();
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
      formData.append('description', form.description || '');
      formData.append('techStack', form.techStack || '');
      formData.append('githubLink', form.githubLink || '');
      formData.append('liveLink', form.liveLink || '');
      
      if (selectedFile) {
        formData.append('image', selectedFile);
      } else if (form.imageUrl) {
        formData.append('image', form.imageUrl);
      }

      if (form._id) {
        await api.put(`/projects/${form._id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      } else {
        await api.post("/projects", formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      }
      await fetchProjects();
      resetForm();
    } catch (e) {
      setError("Failed to save project.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (project) => {
    setForm({
      _id: project._id,
      title: project.title || "",
      description: project.description || "",
      techStack: Array.isArray(project.techStack) ? project.techStack.join(", ") : project.techStack || "",
      githubLink: project.githubLink || "",
      liveLink: project.liveLink || "",
      imageUrl: project.imageUrl || "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this project?")) return;
    setError("");
    try {
      await api.delete(`/projects/${id}`);
      setProjects((prev) => prev.filter((p) => p._id !== id));
      if (form._id === id) resetForm();
    } catch (e) {
      setError("Failed to delete project.");
    }
  };

  const handleView = async (id) => {
    setViewLoading(true);
    setViewError("");
    setSelectedProject(null);
    try {
      const res = await api.get(`/projects/${id}`);
      setSelectedProject(res.data);
    } catch (e) {
      setViewError("Failed to load project details.");
    } finally {
      setViewLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 py-10">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center">
            <p className="text-gray-600">Loading projects...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-6">
          <button
            onClick={() => navigate("/admin")}
            className="mb-4 text-blue-600 hover:text-blue-800 font-medium"
          >
            ← Back to Dashboard
          </button>
          <h1 className="text-3xl font-bold text-gray-800">Manage Projects</h1>
          <p className="text-gray-500">Create, edit, and manage your portfolio projects</p>
        </div>

        {error && <div className="mb-4 bg-red-50 text-red-700 p-3 rounded">{error}</div>}

        <div className="bg-white rounded-xl shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">{form._id ? "Edit Project" : "Create Project"}</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              placeholder="Project Title"
              className="border rounded p-2"
            />
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Project Description"
              className="border rounded p-2 h-32"
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Project Image
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
                name="imageUrl"
                value={form.imageUrl}
                onChange={handleChange}
                placeholder="Image URL (optional)"
                className="border rounded p-2 mt-1 w-full"
              />
              {form.imageUrl && !selectedFile && (
                <div className="mt-2">
                  <p className="text-sm text-blue-600 mb-2">URL Image Preview:</p>
                  <img 
                    src={form.imageUrl} 
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
              name="techStack"
              value={form.techStack}
              onChange={handleChange}
              placeholder="Tech Stack (comma separated)"
              className="border rounded p-2"
            />
            <input
              name="githubLink"
              value={form.githubLink}
              onChange={handleChange}
              placeholder="GitHub Link (optional)"
              className="border rounded p-2"
            />
            <input
              name="liveLink"
              value={form.liveLink}
              onChange={handleChange}
              placeholder="Live Demo Link (optional)"
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
          <h2 className="text-xl font-semibold mb-4">All Projects</h2>
          {selectedProject && (
            <div className="mb-6 border rounded-lg p-4 bg-gray-50">
              <div className="flex items-start justify-between">
                <h3 className="text-lg font-semibold">Preview</h3>
                <button onClick={() => setSelectedProject(null)} className="text-sm underline">Close</button>
              </div>
              {viewError && (
                <div className="mt-2 bg-red-50 text-red-700 p-2 rounded">{viewError}</div>
              )}
              {viewLoading ? (
                <p className="mt-2">Loading...</p>
              ) : (
                <div className="mt-3">
                  <h4 className="text-2xl font-bold mb-1">{selectedProject.title}</h4>
                  <p className="text-gray-500 mb-3">{selectedProject.description}</p>
                  {selectedProject.imageUrl ? (
                    <img 
                      src={selectedProject.imageUrl.startsWith('http') ? selectedProject.imageUrl : `http://localhost:5000${selectedProject.imageUrl}`} 
                      alt={selectedProject.title} 
                      className="w-full rounded mb-4" 
                    />
                  ) : null}
                  {Array.isArray(selectedProject.techStack) && selectedProject.techStack.length > 0 && (
                    <div className="mb-4">
                      <span className="text-gray-600 mr-2">Tech Stack:</span>
                      {selectedProject.techStack.map((tech) => (
                        <span key={tech} className="inline-block bg-blue-100 text-blue-700 text-sm px-2 py-1 rounded mr-2">
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="flex gap-4">
                    {selectedProject.githubLink && (
                      <a href={selectedProject.githubLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                        GitHub
                      </a>
                    )}
                    {selectedProject.liveLink && (
                      <a href={selectedProject.liveLink} target="_blank" rel="noopener noreferrer" className="text-green-600 hover:text-green-800">
                        Live Demo
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
          {loading ? (
            <p>Loading...</p>
          ) : projects.length === 0 ? (
            <p>No projects yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="text-left border-b">
                    <th className="py-2 pr-4">Title</th>
                    <th className="py-2 pr-4">Tech Stack</th>
                    <th className="py-2 pr-4">Links</th>
                    <th className="py-2 pr-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {projects.map((p) => (
                    <tr key={p._id} className="border-b">
                      <td className="py-2 pr-4">{p.title}</td>
                      <td className="py-2 pr-4">{Array.isArray(p.techStack) ? p.techStack.join(", ") : "-"}</td>
                      <td className="py-2 pr-4">
                        <div className="flex gap-2">
                          {p.githubLink && <span className="text-blue-600">GitHub</span>}
                          {p.liveLink && <span className="text-green-600">Live</span>}
                        </div>
                      </td>
                      <td className="py-2 pr-4 flex gap-2">
                        <button onClick={() => handleView(p._id)} className="px-3 py-1 border rounded">
                          View
                        </button>
                        <button onClick={() => handleEdit(p)} className="px-3 py-1 border rounded">
                          Edit
                        </button>
                        <button onClick={() => handleDelete(p._id)} className="px-3 py-1 border rounded text-red-600">
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
