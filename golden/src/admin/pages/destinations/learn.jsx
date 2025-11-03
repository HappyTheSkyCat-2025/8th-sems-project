import React, { useState } from "react";
import "./lern.css";

const Learn = () => {
  const [lessons, setLessons] = useState([
    {
      id: 1,
      title: "Cultural Wonders of Japan",
      country: "Japan",
      description: "Learn about traditional Japanese art, cuisine, and customs.",
      image: "https://images.unsplash.com/photo-1549692520-acc6669e2f0c",
      order: 1,
    },
    {
      id: 2,
      title: "History of Egypt",
      country: "Egypt",
      description: "Discover the mysteries of ancient pyramids and pharaohs.",
      image: "https://images.unsplash.com/photo-1595433707802-0d61c6f27c4e",
      order: 2,
    },
  ]);

  const [selected, setSelected] = useState(null);
  const [tempOrder, setTempOrder] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [newLesson, setNewLesson] = useState({
    title: "",
    country: "",
    description: "",
    image: "",
    order: "",
  });

  const handleDetails = (item) => {
    setSelected(item);
    setTempOrder(item.order);
  };

  const handleDelete = (id) => {
    setLessons(lessons.filter((item) => item.id !== id));
  };

  const handleSave = () => {
    setLessons(
      lessons.map((l) =>
        l.id === selected.id ? { ...l, order: parseInt(tempOrder) || 0 } : l
      )
    );
    setSelected(null);
  };

  const handleAddNew = () => {
    if (
      !newLesson.title ||
      !newLesson.country ||
      !newLesson.description ||
      !newLesson.image
    ) {
      alert("Please fill all fields.");
      return;
    }

    const newItem = {
      id: lessons.length + 1,
      ...newLesson,
      order: parseInt(newLesson.order) || 0,
    };

    setLessons([...lessons, newItem]);
    setNewLesson({
      title: "",
      country: "",
      description: "",
      image: "",
      order: "",
    });
    setShowAddModal(false);
  };

  return (
    <div className="learn-container">
      <div className="learn-header">
        <div>
          <h2 className="learn-heading">📖 Learn</h2>
          <p className="learn-subtitle">
            Educational and informative content about destinations.
          </p>
        </div>
        <button className="add-btn" onClick={() => setShowAddModal(true)}>
          + Add Details
        </button>
      </div>

      <div className="learn-table-wrapper">
        <table className="learn-table">
          <thead>
            <tr>
              <th>Title</th>
              <th className="hide-mobile">Country</th>
              <th className="hide-mobile">Description</th>
              <th className="hide-mobile">Image</th>
              <th className="hide-mobile">Order</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {lessons.map((item) => (
              <tr key={item.id}>
                <td>{item.title}</td>
                <td className="hide-mobile">{item.country}</td>
                <td className="hide-mobile">{item.description}</td>
                <td className="hide-mobile">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="learn-img-circle"
                  />
                </td>
                <td className="hide-mobile">{item.order}</td>
                <td>
                  <button
                    className="details-btn"
                    onClick={() => handleDetails(item)}
                  >
                    Details
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(item.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Details Modal */}
      {selected && (
        <div className="modal-overlay">
          <div className="modal-content fadeIn">
            <h3>Lesson Details</h3>
            <p>
              <strong>Title:</strong> {selected.title}
            </p>
            <p>
              <strong>Country:</strong> {selected.country}
            </p>
            <p>
              <strong>Description:</strong> {selected.description}
            </p>
            <img
              src={selected.image}
              alt={selected.title}
              className="modal-img"
            />
            <div className="order-input">
              <label>
                <strong>Order:</strong>
              </label>
              <input
                type="number"
                value={tempOrder}
                onChange={(e) => setTempOrder(e.target.value)}
              />
            </div>

            <div className="modal-buttons">
              <button className="save-btn" onClick={handleSave}>
                Save
              </button>
              <button className="close-btn" onClick={() => setSelected(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-content fadeIn">
            <h3>Add New Lesson</h3>
            <input
              type="text"
              placeholder="Title"
              value={newLesson.title}
              onChange={(e) =>
                setNewLesson({ ...newLesson, title: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Country"
              value={newLesson.country}
              onChange={(e) =>
                setNewLesson({ ...newLesson, country: e.target.value })
              }
            />
            <textarea
              placeholder="Description"
              value={newLesson.description}
              onChange={(e) =>
                setNewLesson({ ...newLesson, description: e.target.value })
              }
            ></textarea>
            <input
              type="text"
              placeholder="Image URL"
              value={newLesson.image}
              onChange={(e) =>
                setNewLesson({ ...newLesson, image: e.target.value })
              }
            />
            <input
              type="number"
              placeholder="Order"
              value={newLesson.order}
              onChange={(e) =>
                setNewLesson({ ...newLesson, order: e.target.value })
              }
            />

            <div className="modal-buttons">
              <button className="save-btn" onClick={handleAddNew}>
                Save
              </button>
              <button
                className="close-btn"
                onClick={() => setShowAddModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Learn;
