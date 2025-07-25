import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { toast } from "react-toastify";
import axiosInstance from "../utils/axiosInstance";

export default function BlogDetail() {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [comments, setComments] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [nextPageUrl, setNextPageUrl] = useState(null);
  const [prevPageUrl, setPrevPageUrl] = useState(null);
  const [totalCount, setTotalCount] = useState(0);
  const [newComment, setNewComment] = useState("");
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);

  const [showReplyBox, setShowReplyBox] = useState({});
  const [replyText, setReplyText] = useState({});
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editedCommentText, setEditedCommentText] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    axiosInstance
      .get("/accounts/profile/")
      .then((res) => setCurrentUserId(res.data.id))
      .catch(() => setCurrentUserId(null))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    setLoading(true);
    axiosInstance
      .get(`/blogs/${slug}/`)
      .then((res) => {
        setBlog(res.data);
        setLikesCount(res.data.likes_count);
        setLiked(res.data.is_liked);
        setError(null);
        setCurrentPage(1);
      })
      .catch(() => {
        setError("Failed to load blog");
        setBlog(null);
      })
      .finally(() => setLoading(false));
  }, [slug]);

  const fetchComments = (page = 1) => {
    if (!blog) return;
    axiosInstance
      .get(`/blogs/${blog.id}/comments/?page=${page}`)
      .then((res) => {
        const topLevelComments = (res.data.results || []).filter((c) => !c.parent);
        setComments(topLevelComments);
        setNextPageUrl(res.data.next);
        setPrevPageUrl(res.data.previous);
        setTotalCount(res.data.count);
        setTotalPages(Math.ceil(res.data.count / 5));
      })
      .catch(() => {
        setComments([]);
        setTotalCount(0);
        setTotalPages(1);
      });
  };

  useEffect(() => {
    fetchComments(currentPage);
  }, [blog, currentPage]);

  const handleLike = async () => {
    if (!localStorage.getItem("access_token")) {
      return toast.warning("Login to like this blog.");
    }
    setLiked((prevLiked) => !prevLiked);
    setLikesCount((prevCount) => (liked ? prevCount - 1 : prevCount + 1));

    setActionLoading(true);
    try {
      const res = await axiosInstance.post(`/blogs/${blog.id}/toggle-like/`);
      setLiked(res.data.liked);
      setLikesCount(res.data.likes_count);
    } catch {
      setLiked((prevLiked) => !prevLiked);
      setLikesCount((prevCount) => (liked ? prevCount - 1 : prevCount + 1));
      toast.error("Failed to toggle like.");
    }
    setActionLoading(false);
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!localStorage.getItem("access_token")) {
      return toast.warning("Login to comment.");
    }
    if (!newComment.trim()) return;
    setActionLoading(true);
    try {
      await axiosInstance.post(`/blogs/${blog.id}/comments/`, {
        text: newComment.trim(),
      });
      setNewComment("");
      setCurrentPage(1);
      fetchComments(1);
      toast.success("Comment posted successfully!");
    } catch (error) {
      if (error.response?.data) {
        const errMsg =
          typeof error.response.data === "string"
            ? error.response.data
            : JSON.stringify(error.response.data);
        toast.error(`Failed to post comment: ${errMsg}`);
      } else {
        toast.error("Failed to post comment.");
      }
    }
    setActionLoading(false);
  };

  const toggleReplyBox = (commentId) => {
    setShowReplyBox((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));
  };

  const handleReplyTextChange = (commentId, text) => {
    setReplyText((prev) => ({ ...prev, [commentId]: text }));
  };

  const handleReplySubmit = async (parentId) => {
    if (!localStorage.getItem("access_token")) {
      return toast.warning("Login to reply.");
    }
    if (!replyText[parentId] || !replyText[parentId].trim()) return;
    setActionLoading(true);
    try {
      await axiosInstance.post(`/blogs/${blog.id}/comments/`, {
        text: replyText[parentId].trim(),
        parent: parentId,
      });
      setReplyText((prev) => ({ ...prev, [parentId]: "" }));
      setShowReplyBox((prev) => ({ ...prev, [parentId]: false }));
      setCurrentPage(1);
      fetchComments(1);
      toast.success("Reply posted!");
    } catch {
      toast.error("Failed to post reply.");
    }
    setActionLoading(false);
  };

  const startEditing = (comment) => {
    setEditingCommentId(comment.id);
    setEditedCommentText(comment.text);
  };

  const cancelEditing = () => {
    setEditingCommentId(null);
    setEditedCommentText("");
  };

  const saveEditedComment = async () => {
    if (!editedCommentText.trim()) return;
    if (!localStorage.getItem("access_token")) {
      return toast.warning("Login to edit comment.");
    }
    setActionLoading(true);
    try {
      const res = await axiosInstance.put(`/blogs/comments/${editingCommentId}/`, {
        text: editedCommentText.trim(),
      });
      const updatedComment = res.data;
      const updateComments = (commentsList) =>
        commentsList.map((c) => {
          if (c.id === updatedComment.id) return updatedComment;
          if (c.replies && c.replies.length) {
            return { ...c, replies: updateComments(c.replies) };
          }
          return c;
        });
      setComments((prev) => updateComments(prev));
      toast.success("Comment updated.");
      cancelEditing();
    } catch {
      toast.error("Failed to update comment.");
    }
    setActionLoading(false);
  };

  const deleteComment = async (commentId) => {
    if (!window.confirm("Are you sure you want to delete this comment?")) return;
    if (!localStorage.getItem("access_token")) {
      return toast.warning("Login required.");
    }
    setActionLoading(true);
    try {
      await axiosInstance.delete(`/blogs/comments/${commentId}/`);
      setCurrentPage(1);
      fetchComments(1);
      toast.success("Comment deleted.");
    } catch {
      toast.error("Failed to delete comment.");
    }
    setActionLoading(false);
  };

  const toggleCommentLike = async (commentId) => {
    if (!localStorage.getItem("access_token")) {
      return toast.warning("Login to like comments.");
    }
    setComments((prevComments) => {
      const toggleLikeRecursive = (list) =>
        list.map((comment) => {
          if (comment.id === commentId) {
            const likedNow = !comment.is_liked;
            const likesCountNow = likedNow
              ? comment.likes_count + 1
              : comment.likes_count - 1;
            return {
              ...comment,
              is_liked: likedNow,
              likes_count: likesCountNow,
            };
          }
          if (comment.replies && comment.replies.length) {
            return {
              ...comment,
              replies: toggleLikeRecursive(comment.replies),
            };
          }
          return comment;
        });
      return toggleLikeRecursive(prevComments);
    });

    setActionLoading(true);
    try {
      const res = await axiosInstance.post(`/blogs/comments/${commentId}/toggle-like/`);
      const updated = res.data;
      setComments((prevComments) => {
        const updateComments = (list) =>
          list.map((comment) => {
            if (comment.id === updated.id) {
              return {
                ...comment,
                is_liked: updated.is_liked,
                likes_count: updated.likes_count,
              };
            }
            if (comment.replies && comment.replies.length) {
              return { ...comment, replies: updateComments(comment.replies) };
            }
            return comment;
          });
        return updateComments(prevComments);
      });
    } catch {
      toast.error("Failed to like comment.");
      setComments((prevComments) => {
        const toggleLikeRecursive = (list) =>
          list.map((comment) => {
            if (comment.id === commentId) {
              const likedNow = !comment.is_liked;
              const likesCountNow = likedNow
                ? comment.likes_count + 1
                : comment.likes_count - 1;
              return {
                ...comment,
                is_liked: likedNow,
                likes_count: likesCountNow,
              };
            }
            if (comment.replies && comment.replies.length) {
              return {
                ...comment,
                replies: toggleLikeRecursive(comment.replies),
              };
            }
            return comment;
          });
        return toggleLikeRecursive(prevComments);
      });
    }
    setActionLoading(false);
  };

  // Recursive render of comments with Bootstrap classes
  const renderComment = (comment, isReply = false) => (
    <div
      key={comment.id}
      className={`card mb-3 ${isReply ? "ms-4" : ""}`}
      style={isReply ? { borderLeft: "4px solid #0d6efd" } : {}}
    >
      <div className="card-body p-3">
        <div className="d-flex justify-content-between align-items-center mb-1">
          <strong>{comment.author?.username || "Unknown"}</strong>
          <small className="text-muted" style={{ fontSize: "0.8rem" }}>
            {new Date(comment.created_at).toLocaleString()}
          </small>
        </div>

        {editingCommentId === comment.id ? (
          <>
            <textarea
              className="form-control mb-2"
              value={editedCommentText}
              onChange={(e) => setEditedCommentText(e.target.value)}
              disabled={actionLoading}
              rows={3}
            />
            <div>
              <button
                className="btn btn-primary me-2"
                onClick={saveEditedComment}
                disabled={!editedCommentText.trim() || actionLoading}
              >
                Save
              </button>
              <button
                className="btn btn-secondary"
                onClick={cancelEditing}
                disabled={actionLoading}
              >
                Cancel
              </button>
            </div>
          </>
        ) : (
          <p>{comment.text}</p>
        )}

        {editingCommentId !== comment.id && (
          <div className="d-flex flex-wrap gap-2">
            <button
              type="button"
              className={`btn btn-sm btn-outline-primary d-flex align-items-center gap-1 ${
                comment.is_liked ? "active" : ""
              }`}
              onClick={() => toggleCommentLike(comment.id)}
              disabled={actionLoading}
            >
              <span role="img" aria-label="like">
                ❤️
              </span>{" "}
              {comment.likes_count}
            </button>

            <button
              type="button"
              className="btn btn-sm btn-outline-secondary"
              onClick={() => toggleReplyBox(comment.id)}
              disabled={actionLoading}
            >
              Reply
            </button>

            {currentUserId === comment.author?.id && (
              <>
                <button
                  type="button"
                  className="btn btn-sm btn-outline-warning"
                  onClick={() => startEditing(comment)}
                  disabled={actionLoading}
                >
                  Edit
                </button>
                <button
                  type="button"
                  className="btn btn-sm btn-outline-danger"
                  onClick={() => deleteComment(comment.id)}
                  disabled={actionLoading}
                >
                  Delete
                </button>
              </>
            )}
          </div>
        )}

        {showReplyBox[comment.id] && (
          <div className="mt-3">
            <textarea
              className="form-control mb-2"
              rows={2}
              placeholder="Write a reply..."
              value={replyText[comment.id] || ""}
              onChange={(e) => handleReplyTextChange(comment.id, e.target.value)}
              disabled={actionLoading}
            />
            <button
              className="btn btn-primary btn-sm"
              onClick={() => handleReplySubmit(comment.id)}
              disabled={!replyText[comment.id]?.trim() || actionLoading}
            >
              Post Reply
            </button>
          </div>
        )}

        {comment.replies &&
          comment.replies.length > 0 &&
          comment.replies.map((reply) => renderComment(reply, true))}
      </div>
    </div>
  );

  if (loading) return <div className="text-center py-5">Loading blog...</div>;
  if (error) return <div className="alert alert-danger text-center">{error}</div>;
  if (!blog) return <div className="alert alert-warning text-center">Blog not found.</div>;

  return (
    <div className="container my-4">
      <div className="card p-4 mb-5 shadow-sm">
        <h1 className="display-4 mb-3">{blog.title}</h1>

        <div className="d-flex align-items-center gap-3 mb-3">
          {blog.author?.profile_image && (
            <img
              className="rounded-circle"
              style={{ width: 60, height: 60, objectFit: "cover" }}
              src={
                blog.author.profile_image.startsWith("http")
                  ? blog.author.profile_image
                  : `${import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000"}${blog.author.profile_image}`
              }
              alt={blog.author.username}
            />
          )}
          <div>
            <h5 className="text-primary mb-1">{blog.author?.username}</h5>
            {blog.category_details && (
              <Link to={`/blogs?category=${blog.category_details.id}`} className="badge bg-secondary text-decoration-none">
                {blog.category_details.name}
              </Link>
            )}
          </div>
        </div>

        {blog.thumbnail && (
          <img src={blog.thumbnail} alt={blog.title} className="img-fluid rounded mb-4 shadow-sm" />
        )}

        <div
          className="mb-4"
          style={{ fontSize: "1.125rem", lineHeight: 1.6, color: "#444" }}
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />

        {blog.tags && (
          <div className="mb-3">
            <strong>Tags: </strong>
            {blog.tags.split(",").map((tag, i) => (
              <span key={i} className="badge bg-light text-secondary me-1">
                #{tag.trim()}
              </span>
            ))}
          </div>
        )}

        <div className="d-flex align-items-center gap-3 mb-5">
          <button
            className={`btn btn-${liked ? "danger" : "primary"}`}
            onClick={handleLike}
            disabled={actionLoading}
          >
            {liked ? "Liked" : "Like"} <span className="badge bg-light text-dark ms-2">{likesCount}</span>
          </button>
          <span className="text-muted">Views: {blog.views}</span>
        </div>
      </div>

      <div>
        <h4 className="mb-3">Comments ({totalCount})</h4>

        <form onSubmit={handleCommentSubmit} className="mb-4">
          <textarea
            className="form-control mb-2"
            rows={3}
            placeholder="Write a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            required
            disabled={actionLoading}
          />
          <button
            type="submit"
            className="btn btn-primary"
            disabled={!newComment.trim() || actionLoading}
          >
            Post Comment
          </button>
        </form>

        {comments.length > 0 ? (
          comments.map((comment) => renderComment(comment))
        ) : (
          <p className="text-muted fst-italic">No comments yet.</p>
        )}

        {totalPages > 1 && (
          <nav aria-label="Comments pagination">
            <ul className="pagination justify-content-center gap-2 mt-4">
              <li className={`page-item ${!prevPageUrl ? "disabled" : ""}`}>
                <button
                  className="page-link"
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  disabled={!prevPageUrl}
                >
                  Previous
                </button>
              </li>
              <li className="page-item disabled">
                <span className="page-link">
                  Page {currentPage} of {totalPages}
                </span>
              </li>
              <li className={`page-item ${!nextPageUrl ? "disabled" : ""}`}>
                <button
                  className="page-link"
                  onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                  disabled={!nextPageUrl}
                >
                  Next
                </button>
              </li>
            </ul>
          </nav>
        )}
      </div>
    </div>
  );
}
