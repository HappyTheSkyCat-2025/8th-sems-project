import React, { useState, useEffect } from "react";
import axiosInstance from "../../utils/axiosInstance";
import "./blog.css";

const BlogList = () => {
  const [blogs, setBlogs] = useState([]);
  const [categories, setCategories] = useState([{ id: 0, name: "All" }]);
  const [authors, setAuthors] = useState([]);
  const [filterCategory, setFilterCategory] = useState(0);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showBlogForm, setShowBlogForm] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [blogForm, setBlogForm] = useState({
    title: "",
    content: "",
    thumbnail: null,
    author: "",
    category: "",
    status: "",
    tags: "",
    country: "",
  });

  const BLOG_API = "admin-dashboard/blogs/";
  const CATEGORY_API = "admin-dashboard/categories/";
  const AUTHOR_API = "admin-dashboard/users/";

  // Fetch blogs, categories, authors
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [blogRes, catRes, authorRes] = await Promise.all([
          axiosInstance.get(BLOG_API),
          axiosInstance.get(CATEGORY_API),
          axiosInstance.get(AUTHOR_API),
        ]);

        const blogData = Array.isArray(blogRes.data)
          ? blogRes.data
          : blogRes.data.results || [];
        const categoryData = Array.isArray(catRes.data)
          ? catRes.data
          : catRes.data.results || [];
        const authorData = Array.isArray(authorRes.data)
          ? authorRes.data
          : authorRes.data.results || [];

        setBlogs(blogData);
        setCategories([{ id: 0, name: "All" }, ...categoryData]);
        setAuthors(authorData);
      } catch (err) {
        console.error(err);
        setError("Failed to load blogs/categories/authors. Are you admin?");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Delete a blog
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this blog?")) return;
    try {
      await axiosInstance.delete(`${BLOG_API}${id}/`);
      setBlogs((prev) => prev.filter((b) => b.id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete blog");
    }
  };

  // Open edit modal
  const handleEdit = (blog) => {
    setEditingBlog(blog);
    setBlogForm({
      title: blog.title || "",
      author: blog.author || "",
      category: blog.category?.id || "",
      status: blog.status || "",
      country: blog.country || "",
      content: blog.content || "",
      tags: blog.tags || "",
      thumbnail: null,
    });
    setShowBlogForm(true);
  };

  // Save or update blog
  const handleSaveBlog = async () => {
    try {
      const payload = new FormData();
      payload.append("title", blogForm.title);
      payload.append("author", blogForm.author);
      payload.append("category", blogForm.category);
      payload.append("status", blogForm.status);
      payload.append("country", blogForm.country);
      payload.append("content", blogForm.content);
      payload.append("tags", blogForm.tags);
      if (blogForm.thumbnail) payload.append("thumbnail", blogForm.thumbnail);

      let res;
      if (editingBlog) {
        res = await axiosInstance.put(`${BLOG_API}${editingBlog.id}/`, payload, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setBlogs((prev) =>
          prev.map((b) => (b.id === editingBlog.id ? res.data : b))
        );
      } else {
        res = await axiosInstance.post(BLOG_API, payload, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setBlogs((prev) => [res.data, ...prev]);
      }

      setShowBlogForm(false);
      setEditingBlog(null);
      setBlogForm({
        title: "",
        content: "",
        thumbnail: null,
        author: "",
        category: "",
        status: "",
        tags: "",
        country: "",
      });
    } catch (err) {
      console.error(err);
      alert("Failed to save blog");
    }
  };

  // Add new category
  const handleAddCategory = async () => {
    const trimmed = newCategory.trim();
    if (!trimmed) return;
    try {
      const res = await axiosInstance.post(CATEGORY_API, { name: trimmed });
      setCategories((prev) => [...prev, res.data]);
      setNewCategory("");
      setShowAddCategory(false);
    } catch (err) {
      console.error(err);
      alert("Failed to add category");
    }
  };

  const filteredBlogs =
    filterCategory === 0
      ? blogs
      : blogs.filter((b) => b.category?.id === filterCategory);

  if (loading) return <p>Loading blogs...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="blog-container">
      <h2>Blog Management</h2>

      {/* Controls */}
      <div className="blog-controls">
        <div className="category-dropdown">
          <label>Filter by Category: </label>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(Number(e.target.value))}
          >
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>

          <button
            className="add-category-btn"
            onClick={() => setShowAddCategory(!showAddCategory)}
          >
            + Add Category
          </button>
          <button className="add-blog-btn" onClick={() => setShowBlogForm(true)}>
            + Add Blog
          </button>
        </div>

        {showAddCategory && (
          <div className="add-category-form">
            <input
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="New Category"
            />
            <button onClick={handleAddCategory}>Save</button>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="table-wrapper">
        <table className="blog-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Author</th>
              <th>Category</th>
              <th>Status</th>
              <th>Country</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredBlogs.length ? (
              filteredBlogs.map((b) => (
                <tr key={b.id}>
                  <td data-label="Title">{b.title}</td>
                  <td data-label="Author">
                    {authors.find((a) => a.id === b.author)?.username || "—"}
                  </td>
                  <td data-label="Category">{b.category?.name || "—"}</td>
                  <td data-label="Status">{b.status || "—"}</td>
                  <td data-label="Country">{b.country || "—"}</td>
                  <td data-label="Actions">
                    <button className="edit-btn" onClick={() => handleEdit(b)}>
                      Edit
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(b.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" style={{ textAlign: "center" }}>
                  No blogs found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Blog Modal */}
      {showBlogForm && (
        <div className="blog-modal-overlay">
          <div className="blog-modal">
            <h3>{editingBlog ? "Edit Blog" : "Add New Blog"}</h3>
            <input
              placeholder="Title"
              value={blogForm.title}
              onChange={(e) =>
                setBlogForm({ ...blogForm, title: e.target.value })
              }
            />
            <select
              value={blogForm.author}
              onChange={(e) =>
                setBlogForm({ ...blogForm, author: Number(e.target.value) })
              }
            >
              <option value="">Select Author</option>
              {authors.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.username}
                </option>
              ))}
            </select>
            <select
              value={blogForm.category}
              onChange={(e) =>
                setBlogForm({ ...blogForm, category: Number(e.target.value) })
              }
            >
              <option value="">Select Category</option>
              {categories
                .filter((cat) => cat.id !== 0)
                .map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
            </select>
            <input
              placeholder="Status"
              value={blogForm.status}
              onChange={(e) =>
                setBlogForm({ ...blogForm, status: e.target.value })
              }
            />
            <input
              placeholder="Country"
              value={blogForm.country}
              onChange={(e) =>
                setBlogForm({ ...blogForm, country: e.target.value })
              }
            />
            <textarea
              placeholder="Content"
              value={blogForm.content}
              onChange={(e) =>
                setBlogForm({ ...blogForm, content: e.target.value })
              }
              rows={5}
            />
            <input
              placeholder="Tags (comma separated)"
              value={blogForm.tags}
              onChange={(e) =>
                setBlogForm({ ...blogForm, tags: e.target.value })
              }
            />
            <input
              type="file"
              onChange={(e) =>
                setBlogForm({ ...blogForm, thumbnail: e.target.files[0] })
              }
            />

            <div style={{ textAlign: "right", marginTop: "10px" }}>
              <button className="save-btn" onClick={handleSaveBlog}>
                {editingBlog ? "Update" : "Save"}
              </button>
              <button
                className="cancel-btn"
                onClick={() => {
                  setShowBlogForm(false);
                  setEditingBlog(null);
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogList;
