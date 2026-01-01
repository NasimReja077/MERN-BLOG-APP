import React from "react";
import PropTypes from 'prop-types';
import { Link } from "react-router-dom";
import { FiHeart, FiEye, FiMessageCircle, FiClock } from "react-icons/fi";
import { formatRelativeTime, estimateReadTime, formatCompactNumber, getInitials } from '../../../utils/formatters';

const BlogCard = ({ blog }) => {
  const likeCount = blog.likeCount || blog.likes?.count || 0;
  const viewCount = blog.viewCount || blog.views?.count || 0;
  const commentsCount = blog.commentsCount || 0;

  return (
    <div className="group relative overflow-hidden rounded-2xl bg-base-100 shadow-lg transition-all duration-500 hover:shadow-2xl hover:-translate-y-3">
      {/* Thumbnail */}
      <Link to={`/blogs/${blog._id}`} className="block">
        <div className="relative overflow-hidden">
          <img
            src={blog.thumbnail || "https://via.placeholder.com/800x600"}
            alt={blog.title}
            className="h-64 w-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </div>
      </Link>

      <div className="p-7">
        {/* Category & Meta */}
        <div className="mb-4 flex flex-wrap items-center gap-4 text-sm">
          {blog.category && (
            <span className="rounded-full bg-primary/10 px-4 py-1.5 text-primary font-semibold">
              {blog.category}
            </span>
          )}
          <div className="flex items-center gap-1.5 text-base-content/60">
            <FiClock className="size-4" />
            <span>{estimateReadTime(blog.content)} min read</span>
          </div>
          <span className="text-base-content/50">
            {formatRelativeTime(blog.createdAt)}
          </span>
        </div>

        {/* Title */}
        <Link to={`/blogs/${blog._id}`}>
          <h2 className="mb-4 text-2xl font-bold text-base-content line-clamp-2 group-hover:text-primary transition-colors">
            {blog.title}
          </h2>
        </Link>

        {/* Summary */}
        {blog.summary && (
          <p className="mb-6 text-base-content/70 line-clamp-3 leading-relaxed">
            {blog.summary}
          </p>
        )}

        {/* Author */}
        <div className="mb-6 flex items-center gap-4">
          <Link
            to={`/other-user-profile/${blog.author?._id}`}
            className="flex items-center gap-3 hover:opacity-80 transition"
          >
            <div className="avatar">
              <div className="w-12 rounded-full ring-4 ring-primary/20 overflow-hidden flex items-center justify-center">
                {blog.author?.avatar ? (
                  <img
                    src={blog.author.avatar}
                    alt={blog.author?.username}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div className="w-12 h-12 bg-primary text-white flex items-center justify-center font-bold">
                    {getInitials(blog.author?.username)}
                  </div>
                )}
              </div>
            </div>
            <div>
              <p className="font-semibold text-base-content">{blog.author?.username}</p>
              <p className="text-sm text-base-content/60">{blog.author?.fullName || "Writer"}</p>
            </div>
          </Link>
        </div>

        {/* Stats & Tags */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-base-300 pt-5">
          <div className="flex items-center gap-6 text-base-content/70">
            <button className="flex items-center gap-2 hover:text-red-500 transition">
              <FiHeart className="size-5" />
              <span className="font-medium">{formatCompactNumber(likeCount)}</span>
            </button>
            <div className="flex items-center gap-2">
              <FiEye className="size-5" />
              <span className="font-medium">{formatCompactNumber(viewCount)}</span>
            </div>
            <div className="flex items-center gap-2">
              <FiMessageCircle className="size-5" />
              <span className="font-medium">{formatCompactNumber(commentsCount)}</span>
            </div>
          </div>

          {/* Tags */}
          {blog.tags && blog.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {blog.tags.slice(0, 3).map((tag, idx) => (
                <span
                  key={idx}
                  className="rounded-full bg-base-200 px-3 py-1 text-xs font-medium text-base-content/70"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export const BlogCardGrid = ({ blogs = [], loading = false }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="animate-pulse rounded-2xl bg-base-200"
            style={{ height: "560px" }}
          />
        ))}
      </div>
    );
  }

  if (blogs.length === 0) {
    return (
      <div className="py-20 text-center">
        <h3 className="text-3xl font-bold text-base-content/60 mb-4">No blogs yet</h3>
        <p className="text-base-content/50 mb-8">Be the first to share your story!</p>
        <Link to="/blogs/create" className="btn btn-primary btn-lg">
          Write a Blog
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {blogs.map((blog) => (
        <BlogCard key={blog._id} blog={blog} />
      ))}
    </div>
  );
};

BlogCard.propTypes = {
  blog: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string,
    summary: PropTypes.string,
    thumbnail: PropTypes.string,
    tags: PropTypes.arrayOf(PropTypes.string),
    category: PropTypes.string,
    createdAt: PropTypes.string,
    author: PropTypes.shape({
      _id: PropTypes.string,
      username: PropTypes.string,
      avatar: PropTypes.string,
      fullName: PropTypes.string,
    }),
    likes: PropTypes.shape({ count: PropTypes.number }),
    views: PropTypes.shape({ count: PropTypes.number }),
    commentsCount: PropTypes.number,
    content: PropTypes.string,
    featured: PropTypes.bool,
  }).isRequired,
};

BlogCardGrid.propTypes = {
  blogs: PropTypes.arrayOf(PropTypes.shape({ _id: PropTypes.string.isRequired })),
  loading: PropTypes.bool,
};