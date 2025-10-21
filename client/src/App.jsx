import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Projects from "./pages/Projects";
import Contact from "./pages/Contact";
import Blogs from "./pages/Blogs";
import BlogDetail from "./pages/BlogDetail";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import ManageBlogs from "./pages/ManageBlogs";
import ManageContacts from "./pages/ManageContacts";

export default function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/blogs" element={<Blogs />} />
            <Route path="/blogs/:id" element={<BlogDetail />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route
              path="/admin"
              element={
                <ProtectedRoute adminOnly>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            ></Route>
            <Route
              path="/manage-blogs"
              element={
                <ProtectedRoute adminOnly>
                  <ManageBlogs />
                </ProtectedRoute>
              }
            ></Route>
            <Route
              path="/manage-contacts"
              element={
                <ProtectedRoute adminOnly>
                  <ManageContacts />
                </ProtectedRoute>
              }
            ></Route>
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}
