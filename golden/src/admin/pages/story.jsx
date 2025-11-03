import React, { useState } from "react";
import "./story.css";

const Story = () => {
  const [stories, setStories] = useState([
    {
      id: 1,
      name: "Dipesh Thapa",
      location: "Kathmandu, Nepal",
      photo: "https://i.pravatar.cc/80?img=12",
    },
    {
      id: 2,
      name: "Riya Sharma",
      location: "Pokhara, Nepal",
      photo: "https://i.pravatar.cc/80?img=8",
    },
    {
      id: 3,
      name: "Rahul Joshi",
      location: "Biratnagar, Nepal",
      photo: "https://i.pravatar.cc/80?img=15",
    },
  ]);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this story?")) {
      setStories((prevStories) => prevStories.filter((story) => story.id !== id));
    }
  };

  return (
    <div className="story-admin-container">
      <h2 className="story-admin-title">Story Management</h2>

      <div className="story-table-wrapper">
        <table className="story-admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Photo</th>
              <th>Name</th>
              <th>Location</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {stories.length > 0 ? (
              stories.map((story) => (
                <tr key={story.id}>
                  <td>{story.id}</td>
                  <td>
                    <img src={story.photo} alt={story.name} className="story-photo" />
                  </td>
                  <td>{story.name}</td>
                  <td>{story.location}</td>
                  <td>
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
                <td colSpan="5" className="no-data">
                  No stories available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Story;
