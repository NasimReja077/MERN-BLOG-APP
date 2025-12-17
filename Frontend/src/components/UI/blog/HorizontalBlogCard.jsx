import React from "react";
import { Link } from "react-router-dom";
import { FiHeart, FiEye, FiClock, FiStar } from "react-icons/fi";
import { formatDistanceToNow } from "date-fns";

const HorizontalBlogCard = ({ blog }) => {
  const likeCount = blog.likeCount || blog.likes?.count || 0;
  const viewCount = blog.viewCount || blog.views?.count || 0;
  const readTime = Math.ceil((blog.content?.length || 1500) / 300);
  const tags = blog.tags || [];

  return (
    <article className="group relative overflow-hidden rounded-3xl bg-base-100 border border-base-300 shadow-xl transition-all duration-500 hover:shadow-2xl hover:-translate-y-3">
      <div className="grid grid-cols-1 md:grid-cols-12">
        
        {/* IMAGE SECTION */}
        <div className="md:col-span-5 relative overflow-hidden aspect-4/3 md:aspect-auto md:h-full">
          <Link to={`/blogs/${blog._id}`} className="block h-full">
            <img
              src={blog.thumbnail || "https://via.placeholder.com/800x600"}
              alt={blog.title}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />
          </Link>

          {/* CATEGORY BADGE */}
          {blog.category && (
            <Link
              to={`/category/${blog.category.toLowerCase()}`}
              onClick={(e) => e.stopPropagation()}
              className="absolute top-4 left-4 z-10"
            >
              <span className="rounded-full bg-teal-600 px-4 py-2 text-sm font-semibold text-white shadow-md hover:bg-teal-700 transition">
                {blog.category}
              </span>
            </Link>
          )}

          {/* FEATURED BADGE */}
          {blog.featured && (
            <div className="absolute top-4 right-4 z-10">
              <span className="flex items-center gap-2 rounded-full bg-linear-to-r from-amber-500 to-orange-600 px-4 py-2 text-sm font-semibold text-white shadow-md">
                <FiStar className="w-4 h-4" />
                Featured
              </span>
            </div>
          )}
        </div>

        {/* CONTENT SECTION */}
        <div className="md:col-span-7 p-8 lg:p-10 flex flex-col justify-between">
          
          <div className="space-y-6">
            <Link to={`/blogs/${blog._id}`}>
              <h2 className="text-3xl lg:text-4xl font-extrabold leading-tight text-base-content line-clamp-3 group-hover:text-teal-500 transition">
                {blog.title}
              </h2>
            </Link>

            {blog.summary && (
              <p className="text-lg text-base-content/70 leading-relaxed line-clamp-3">
                {blog.summary}
              </p>
            )}

            {/* TAGS */}
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tags.slice(0, 4).map((tag, idx) => (
                  <Link
                    key={idx}
                    to={`/tag/${tag.toLowerCase()}`}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <span className="rounded-full bg-teal-500/10 px-3 py-1.5 text-sm font-medium text-teal-600 hover:bg-teal-500/20 transition">
                      #{tag}
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* META SECTION */}
          <div className="mt-8 pt-6 border-t border-base-300 flex flex-wrap items-center justify-between gap-6">
            
            {/* AUTHOR */}
            <Link
              to={`/other-user-profile/${blog.author?._id}`}
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-4 hover:opacity-80 transition"
            >
              <img
                src={blog.author?.avatar || "/default-avatar.png"}
                alt={blog.author?.username}
                className="w-12 h-12 rounded-full object-cover ring-4 ring-teal-500/20"
              />
              <div>
                <p className="font-bold text-base-content">
                  {blog.author?.username}
                </p>
                <p className="text-sm text-base-content/60">
                  {formatDistanceToNow(new Date(blog.createdAt), {
                    addSuffix: true,
                  })}
                </p>
              </div>
            </Link>

            {/* STATS */}
            <div className="flex items-center gap-6 text-base-content/70">
              <span className="flex items-center gap-2">
                <FiEye className="w-5 h-5" />
                {viewCount.toLocaleString()}
              </span>
              <span className="flex items-center gap-2 text-red-500">
                <FiHeart className="w-5 h-5 fill-red-500" />
                {likeCount.toLocaleString()}
              </span>
              <span className="flex items-center gap-2">
                <FiClock className="w-5 h-5" />
                {readTime} mins
              </span>
            </div>
          </div>

        </div>
      </div>
    </article>
  );
};

export default HorizontalBlogCard;