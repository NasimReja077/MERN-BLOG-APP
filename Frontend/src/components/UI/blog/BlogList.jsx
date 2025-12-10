import React from 'react';
import { BlogCard } from './BlogCard';
import { Loading } from '../../feedback/Loading';


export const BlogList = ({ blogs, loading }) => {
  if (loading) {
    return <Loading />;
  }

  if (!blogs || blogs.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No blogs found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {blogs.map((blog) => (
        <BlogCard key={blog._id} blog={blog} />
      ))}
    </div>
  );
};