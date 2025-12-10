import React from 'react';
import { Link } from 'react-router-dom';
import { FiHeart } from "react-icons/fi";
import { HiOutlineEye } from "react-icons/hi";
import { LuMessageCircleMore } from "react-icons/lu";
import { LuCalendarDays } from "react-icons/lu";
import { formatDistance } from 'date-fns';

export const BlogCard = ({ blog }) => {
  return (
    <div className="card hover:shadow-lg transition-shadow duration-300 bg-amber-200">
      {blog.thumbnail && (
        <Link to={`/blog/${blog._id}`}>
          <img
            src={blog.thumbnail}
            alt={blog.title}
            className="w-full h-48 object-cover rounded-t-lg mb-4 -mt-6 -mx-6"
          />
        </Link>
      )}
      
      <div className="space-y-3">
        <div className="flex items-center space-x-4 text-sm text-gray-500">
          <div className="flex items-center space-x-1">
            <LuCalendarDays size={16} />
            <span>{formatDistance(new Date(blog.createdAt), new Date(), { addSuffix: true })}</span>
          </div>
          {blog.category && (
            <span className="px-2 py-1 bg-primary/10 text-primary rounded text-xs">{blog.category}</span>
          )}
        </div>

        <Link to={`/blog/${blog._id}`}>
          <h2 className="text-2xl font-bold hover:text-primary transition line-clamp-2">
            {blog.title}
          </h2>
        </Link>

        {blog.summary && (
          <p className="text-gray-600 line-clamp-3">{blog.summary}</p>
        )}

        <div className="flex items-center justify-between pt-4 border-t">
          <Link to={`/profile/${blog.author._id}`} className="flex items-center space-x-2 hover:opacity-75 transition">
            {blog.author.avatar ? (
              <img src={blog.author.avatar} alt={blog.author.username} className="w-8 h-8 rounded-full object-cover" />
            ) : (
              <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center">
                {blog.author.username[0].toUpperCase()}
              </div>
            )}
            <span className="text-sm font-medium">{blog.author.username}</span>
          </Link>

          <div className="flex items-center space-x-4 text-gray-500 text-sm">
            <div className="flex items-center space-x-1">
              <FiHeart size={16} />
              <span>{blog.likes?.count || 0}</span>
            </div>
            <div className="flex items-center space-x-1">
              <HiOutlineEye size={16} />
              <span>{blog.views?.count || 0}</span>
            </div>
            <div className="flex items-center space-x-1">
              <LuMessageCircleMore size={16} />
              <span>{blog.commentsCount || 0}</span>
            </div>
          </div>
        </div>

        {blog.tags && blog.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-2">
            {blog.tags.slice(0, 3).map((tag, index) => (
              <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
