// Frontend/src/pages/BlogDetails.jsx
import React, { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchBlogById, likeBlog } from "../store/features/blogSlice";
import { Loading } from "../components/feedback/Loading";
import toast from "react-hot-toast";
import { TiHeartOutline } from "react-icons/ti";
import { BsEye } from "react-icons/bs";
import { MdOutlineCalendarMonth } from "react-icons/md";
import { FaRegClock, FaEdit } from "react-icons/fa";
import { blogApi } from "../api/blogApi";
import { ROUTES } from "../components/constants";
import { estimateReadTime, formatDate } from "../utils/formatters";
import { IoMdTimer } from "react-icons/io";

export const BlogDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { currentBlog, loading, error } = useSelector((state) => state.blog);
  const { user: currentUser } = useSelector((state) => state.auth);

  useEffect(() => {
    if (id) {
      dispatch(fetchBlogById(id));
      blogApi.trackView(id).catch(() => {});
    }
  }, [id, dispatch]);

  const handleLike = async () => {
    try {
      await dispatch(likeBlog(id)).unwrap();
      toast.success("Liked!");
    } catch (err) {
      toast.error(err?.message || "Failed to like blog");
    }
  };

  if (loading) {
    return <Loading fullScreen />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-error mb-4">Error Loading Blog</h2>
          <p className="text-base-content/70">{error}</p>
          <Link to="/blogs" className="btn btn-primary mt-6">
            Back to Blogs
          </Link>
        </div>
      </div>
    );
  }

  if (!currentBlog) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Blog Not Found</h2>
          <Link to={ROUTES.BLOGS} className="btn btn-primary">
            Browse Blogs
          </Link>
        </div>
      </div>
    );
  }

  const {
    title,
    content,
    summary,
    thumbnail,
    author,
    createdAt,
    updatedAt,
    category,
    tags = [],
  } = currentBlog;

  const safeAuthor = author || {};
  const isOwner = currentUser?._id === safeAuthor._id;

  // Determine like count and liked status
  const actualLikeCount = currentBlog.likeCount ?? currentBlog.likes?.count ?? 0;
  const likedUsers = currentBlog.likes?.users ?? [];
  const isLiked = currentUser ? likedUsers.includes(currentUser._id) : false;

  // Determine view count
  const actualViewCount = currentBlog.viewCount ?? currentBlog.views?.count ?? 0;

  return (
    <div className="min-h-screen bg-base-200 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="bg-base-100 rounded-2xl shadow-xl overflow-hidden">
          {/* Thumbnail */}
          {thumbnail && (
            <div className="w-full h-96 overflow-hidden">
              <img src={thumbnail} alt={title} className="w-full h-full object-cover" />
            </div>
          )}

          <div className="p-8 lg:p-12">
            {/* Category & Tags */}
            <div className="flex flex-wrap gap-3 mb-6">
              {category && <span className="badge badge-primary badge-lg">{category}</span>}
              {tags.map((tag, idx) => (
                <span key={idx} className="badge badge-outline badge-lg">
                  {tag}
                </span>
              ))}
            </div>

            {/* Title */}
            <h1 className="text-4xl lg:text-5xl font-bold text-base-content mb-6">{title}</h1>

            {/* Summary */}
            {summary && (
              <p className="text-xl text-base-content/80 mb-8 italic border-l-4 border-primary pl-6">
                {summary}
              </p>
            )}

            {/* Author & Meta */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-10">
              <Link
                to={`/other-user-profile/${safeAuthor?._id}`}
                className="flex items-center gap-4 hover:opacity-80 transition"
              >
                <div className="avatar">
                  <div className="w-16 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                    <img
                      src={safeAuthor?.avatar || "/default-avatar.png"}
                      alt={safeAuthor?.username}
                    />
                  </div>
                </div>
                <div>
                  <p className="text-lg font-semibold">{safeAuthor?.username}</p>
                  <p className="text-sm text-base-content/60">{safeAuthor?.fullName}</p>
                </div>
              </Link>

              <div className="flex flex-wrap gap-6 text-base-content/70">
                <div className="flex items-center gap-2">
                  <MdOutlineCalendarMonth className="size-5" />
                  <span>{formatDate(createdAt)}</span>
                </div>
                {updatedAt && updatedAt !== createdAt && (
                  <div className="flex items-center gap-2">
                    <FaRegClock className="size-5" />
                    <span>Updated {formatDate(updatedAt)}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <BsEye className="size-5" />
                  <span>{actualViewCount} views</span>
                </div>
                <div className="flex items-center gap-2">
                  <IoMdTimer className="size-5" />
                  <span>{estimateReadTime(content || "")} min read</span>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="prose prose-lg max-w-none text-base-content/90 mb-10">
              <div dangerouslySetInnerHTML={{ __html: content }} />
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-8 border-t border-base-300">
              <button
                onClick={handleLike}
                disabled={!currentUser || loading}
                className={`btn btn-lg ${isLiked ? "btn-error" : "btn-primary"} gap-3`}
              >
                <TiHeartOutline className={`size-6 ${isLiked ? "fill-current" : ""}`} />
                <span>{actualLikeCount} Likes</span>
              </button>

              {isOwner && (
                <div className="flex gap-3">
                  <Link to={`/blogs/edit/${id}`} className="btn btn-outline btn-lg gap-2">
                    <FaEdit className="h-5 w-5" />
                    Edit Blog
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Back Button */}
        <div className="text-center mt-10">
          <Link to={ROUTES.BLOGS} className="btn btn-ghost btn-lg">
            ← Back to All Blogs
          </Link>
        </div>
      </div>
    </div>
  );
};