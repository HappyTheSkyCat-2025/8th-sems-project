import React, { useState } from "react";
import "./blog.css";

const BlogList = () => {
  const [blogs, setBlogs] = useState([
    { id: 1, title: "Summer in Bali", author: "John Doe", category: "Travel", status: "Published", country: "Indonesia" },
    { id: 2, title: "Mountain Trekking", author: "Jane Smith", category: "Adventure", status: "Draft", country: "Nepal" },
    { id: 3, title: "City Guide: Paris", author: "Alice Brown", category: "Travel", status: "Published", country: "France" },
    { id: 4, title: "Local Cuisine", author: "Bob White", category: "Food", status: "Published", country: "Italy" },
  ]);

  const [categories, setCategories] = useState(["All", "Travel", "Adventure", "Food", "Culture", "Lifestyle"]);
  const [filterCategory, setFilterCategory] = useState("All");
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCategory, setNewCategory] = useState("");

  const filteredBlogs = filterCategory === "All"
    ? blogs
    : blogs.filter(blog => blog.category === filterCategory);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this blog?")) {
      setBlogs(blogs.filter(blog => blog.id !== id));
    }
  };

  const handleAddCategory = () => {
    if (newCategory.trim() !== "" && !categories.includes(newCategory.trim())) {
      setCategories([...categories, newCategory.trim()]);
      setNewCategory("");
      setShowAddCategory(false);
    }
  };

  return (
    <div className="blog-container">
      <h2>Blog Management</h2>

      <div className="blog-controls">
        <div className="category-dropdown">
          <label htmlFor="category">Filter by Category: </label>
          <select
            id="category"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <button 
            className="add-category-btn" 
            onClick={() => setShowAddCategory(!showAddCategory)}
          >
            + Add Category
          </button>
        </div>

        {showAddCategory && (
          <div className="add-category-form">
            <input 
              type="text" 
              value={newCategory} 
              onChange={(e) => setNewCategory(e.target.value)} 
              placeholder="New Category"
            />
            <button onClick={handleAddCategory}>Save</button>
          </div>
        )}
      </div>

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
            {filteredBlogs.map(blog => (
              <tr key={blog.id}>
                <td data-label="Title">{blog.title}</td>
                <td data-label="Author">{blog.author}</td>
                <td data-label="Category">{blog.category}</td>
                <td data-label="Status">{blog.status}</td>
                <td data-label="Country">{blog.country}</td>
                <td data-label="Actions">
                  <button className="delete-btn" onClick={() => handleDelete(blog.id)}>Delete</button>
                </td>
              </tr>
            ))}
            {filteredBlogs.length === 0 && (
              <tr>
                <td colSpan="6" style={{ textAlign: "center" }}>
                  No blogs found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BlogList;
