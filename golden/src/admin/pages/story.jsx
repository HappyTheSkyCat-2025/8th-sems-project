import React, { useState, useEffect } from "react";
import axiosInstance from "../../utils/axiosInstance";
import "./story.css";

const Story = () => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showStoryForm, setShowStoryForm] = useState(false);
  const [editingStory, setEditingStory] = useState(null);
  const [storyForm, setStoryForm] = useState({
    name: "",
    location: "",
    message: "",
    photo: null,
  });

  const STORY_API = "admin-dashboard/stories/";

  // Fetch stories
  useEffect(() => {
    const fetchStories = async () => {
      setLoading(true);
      try {
        const res = await axiosInstance.get(STORY_API);
        const data = Array.isArray(res.data)
          ? res.data
          : res.data.results || [];
        setStories(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load stories. Are you admin?");
      } finally {
        setLoading(false);
      }
    };

    fetchStories();
  }, []);

  // Delete story
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this story?")) return;
    try {
      await axiosInstance.delete(`${STORY_API}${id}/`);
      setStories((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete story");
    }
  };

  // Open add/edit form
  const handleEdit = (story) => {
    setEditingStory(story);
    setStoryForm({
      name: story.name || "",
      location: story.location || "",
      message: story.message || "",
      photo: null, // keep null unless changed
    });
    setShowStoryForm(true);
  };

  const handleAdd = () => {
    setEditingStory(null);
    setStoryForm({
      name: "",
      location: "",
      message: "",
      photo: null,
    });
    setShowStoryForm(true);
  };

  // Save or update story
  const handleSaveStory = async () => {
    try {
      const payload = new FormData();
      payload.append("name", storyForm.name);
      payload.append("location", storyForm.location);
      payload.append("message", storyForm.message);
      if (storyForm.photo) payload.append("photo", storyForm.photo);

      let res;
      if (editingStory) {
        res = await axiosInstance.put(
          `${STORY_API}${editingStory.id}/`,
          payload,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        setStories((prev) =>
          prev.map((s) => (s.id === editingStory.id ? res.data : s))
        );
      } else {
        res = await axiosInstance.post(STORY_API, payload, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setStories((prev) => [res.data, ...prev]);
      }

      setShowStoryForm(false);
      setEditingStory(null);
      setStoryForm({ name: "", location: "", message: "", photo: null });
    } catch (err) {
      console.error(err);
      alert("Failed to save story");
    }
  };

  if (loading) return <p>Loading stories...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="story-admin-container">
      <h2 className="story-admin-title">Story Management</h2>

      <button className="add-story-btn" onClick={handleAdd}>
        + Add Story
      </button>

      <div className="story-table-wrapper">
        <table className="story-admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Photo</th>
              <th>Name</th>
              <th>Location</th>
              <th>Message</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {stories.length > 0 ? (
              stories.map((story) => (
                <tr key={story.id}>
                  <td>{story.id}</td>
                  <td>
                    <img
                      src={story.photo}
                      alt={story.name}
                      className="story-photo"
                    />
                  </td>
                  <td>{story.name}</td>
                  <td>{story.location}</td>
                  <td>{story.message}</td>
                  <td>
                    <button
                      className="story-edit-btn"
                      onClick={() => handleEdit(story)}
                    >
                      Edit
                    </button>
                    <button
                      className="story-delete-btn"
                      onClick={() => handleDelete(story.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="no-data">
                  No stories available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Story Modal */}
      {showStoryForm && (
        <div className="story-modal-overlay">
          <div className="story-modal">
            <h3>{editingStory ? "Edit Story" : "Add New Story"}</h3>
            <input
              placeholder="Name"
              value={storyForm.name}
              onChange={(e) =>
                setStoryForm({ ...storyForm, name: e.target.value })
              }
            />
            <input
              placeholder="Location"
              value={storyForm.location}
              onChange={(e) =>
                setStoryForm({ ...storyForm, location: e.target.value })
              }
            />
            <textarea
              placeholder="Message"
              value={storyForm.message}
              onChange={(e) =>
                setStoryForm({ ...storyForm, message: e.target.value })
              }
              rows={4}
            />
            <input
              type="file"
              onChange={(e) =>
                setStoryForm({ ...storyForm, photo: e.target.files[0] })
              }
            />

            <div style={{ textAlign: "right", marginTop: "10px" }}>
              <button className="save-btn" onClick={handleSaveStory}>
                {editingStory ? "Update" : "Save"}
              </button>
              <button
                className="cancel-btn"
                onClick={() => {
                  setShowStoryForm(false);
                  setEditingStory(null);
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

export default Story;
