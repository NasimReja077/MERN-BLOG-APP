// Frontend/src/components/UI/blog/BlogList.jsx
import React from 'react';
import PropTypes from 'prop-types';
import { BlogCard } from './BlogCard';
import { Loading } from '../../feedback/Loading';
import { formatCompactNumber } from '../../../utils/formatters';


export const BlogList = ({ blogs = [], loading = false }) => {
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
    <>
      <div className="mb-6 text-sm text-gray-500">Showing {formatCompactNumber(blogs.length)} stories</div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogs.map((blog) => (
          <BlogCard key={blog._id} blog={blog} />
        ))}
      </div>
    </>
  );
};

BlogList.propTypes = {
  blogs: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      title: PropTypes.string,
      summary: PropTypes.string,
      thumbnail: PropTypes.string,
    })
  ),
  loading: PropTypes.bool,
};