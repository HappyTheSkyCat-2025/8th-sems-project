import React, { useEffect, useState } from "react";
import {
  getBlogs,
  deleteBlog,
  createBlog,
  updateBlog,
  getBlog,
} from "../api/blogApi";
import BlogForm from "../components/BlogForm";
import "./blog.css";

const BlogList = () => {
  const [blogs, setBlogs] = useState([]);
  const [next, setNext] = useState(null);
  const [previous, setPrevious] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState(null);

  const fetchBlogs = async (url = null) => {
    try {
      const res = await getBlogs(url);
      setBlogs(res.data.results);
      setNext(res.data.next);
      setPrevious(res.data.previous);
    } catch (err) {
      console.error("Failed to fetch blogs", err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this blog?")) {
      try {
        await deleteBlog(id);
        setBlogs((prev) => prev.filter((blog) => blog.id !== id));
      } catch (err) {
        console.error("Failed to delete blog", err);
      }
    }
  };

  const handleSave = async (formData) => {
    try {
      if (selectedBlog && selectedBlog.id) {
        await updateBlog(selectedBlog.id, formData);
      } else {
        await createBlog(formData);
      }
      setShowForm(false);
      setSelectedBlog(null);
      fetchBlogs();
    } catch (err) {
      console.error("Failed to save blog", err);
    }
  };

  const handleEdit = async (id) => {
    try {
      const res = await getBlog(id);
      setSelectedBlog(res.data);
      setShowForm(true);
    } catch (err) {
      console.error("Failed to load blog", err);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  return (
    <div>
      <h2>Blog Management</h2>
      <button
        className="create-btn"
        onClick={() => {
          setSelectedBlog(null);
          setShowForm(true);
        }}
      >
        + Create Blog
      </button>

      <table className="blog-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Author</th>
            <th>Status</th>
            <th>Views</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {blogs.map((b) => (
            <tr key={b.id}>
              <td>{b.id}</td>
              <td>{b.title}</td>
              <td>{b.author}</td>
              <td>{b.status}</td>
              <td>{b.views}</td>
              <td>
                <button
                  onClick={() => handleEdit(b.id)}
                  className="edit-btn"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(b.id)}
                  className="delete-btn"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pagination">
        {previous && <button onClick={() => fetchBlogs(previous)}>← Previous</button>}
        {next && <button onClick={() => fetchBlogs(next)}>Next →</button>}
      </div>

      {showForm && (
        <BlogForm
          blog={selectedBlog}
          onSave={handleSave}
          onClose={() => setShowForm(false)}
        />
      )}
    </div>
  );
};

export default BlogList;
