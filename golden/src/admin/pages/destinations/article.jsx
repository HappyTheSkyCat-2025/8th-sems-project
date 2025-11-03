import React, { useState } from "react";
import "./article.css";

const Article = () => {
  const [articles, setArticles] = useState([
    {
      id: 1,
      title: "Exploring Bali",
      country: "Indonesia",
      location: "Ubud",
      image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
      suggested: false,
      inspirational: true,
    },
    {
      id: 2,
      title: "Discovering Paris",
      country: "France",
      location: "Eiffel Tower",
      image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34",
      suggested: true,
      inspirational: false,
    },
  ]);

  const [selected, setSelected] = useState(null);
  const [tempData, setTempData] = useState({
    suggested: false,
    inspirational: false,
  });

  const openDetails = (article) => {
    setSelected(article);
    setTempData({
      suggested: article.suggested,
      inspirational: article.inspirational,
    });
  };

  const closeModal = () => setSelected(null);

  const saveChanges = () => {
    setArticles(
      articles.map((item) =>
        item.id === selected.id
          ? {
              ...item,
              suggested: tempData.suggested,
              inspirational: tempData.inspirational,
            }
          : item
      )
    );
    closeModal();
  };

  const deleteArticle = (id) =>
    setArticles(articles.filter((item) => item.id !== id));

  return (
    <div className="article-container">
      <h2 className="article-heading">🗞️ Articles</h2>
      <p className="article-subtitle">
        Create and manage travel-related articles and guides.
      </p>

      <div className="article-table-wrapper">
        <table className="article-table">
          <thead>
            <tr>
              <th>Title</th>
              <th className="hide-mobile">Country</th>
              <th className="hide-mobile">Location</th>
              <th className="hide-mobile">Image</th>
              <th className="hide-mobile">Suggested</th>
              <th className="hide-mobile">Inspirational</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {articles.map((article) => (
              <tr key={article.id}>
                <td>{article.title}</td>
                <td className="hide-mobile">{article.country}</td>
                <td className="hide-mobile">{article.location}</td>
                <td className="hide-mobile">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="article-img-circle"
                  />
                </td>
                <td className="hide-mobile">
                  <input type="checkbox" checked={article.suggested} readOnly />
                </td>
                <td className="hide-mobile">
                  <input
                    type="checkbox"
                    checked={article.inspirational}
                    readOnly
                  />
                </td>
                <td>
                  <button
                    className="details-btn"
                    onClick={() => openDetails(article)}
                  >
                    Details
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => deleteArticle(article.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {selected && (
        <div className="modal-overlay">
          <div className="modal-content fadeIn">
            <h3>Article Details</h3>
            <p><strong>Title:</strong> {selected.title}</p>
            <p><strong>Country:</strong> {selected.country}</p>
            <p><strong>Location:</strong> {selected.location}</p>
            <img
              src={selected.image}
              alt={selected.title}
              className="modal-img"
            />

            <div className="checkbox-row">
              <label>
                <input
                  type="checkbox"
                  checked={tempData.suggested}
                  onChange={() =>
                    setTempData({ ...tempData, suggested: !tempData.suggested })
                  }
                />
                Suggested
              </label>
            </div>

            <div className="checkbox-row">
              <label>
                <input
                  type="checkbox"
                  checked={tempData.inspirational}
                  onChange={() =>
                    setTempData({
                      ...tempData,
                      inspirational: !tempData.inspirational,
                    })
                  }
                />
                Inspirational
              </label>
            </div>

            <div className="modal-buttons">
              <button className="save-btn" onClick={saveChanges}>
                Save
              </button>
              <button className="close-btn" onClick={closeModal}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Article;
