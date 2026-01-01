// Frontend/src/pages/AllBlogs.jsx
import React, { useEffect } from "react";
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { fetchBlogs } from "../store/features/blogSlice";
import { HorizontalBlogList } from "../components/UI/blog/HorizontalBlogList";
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE, ROUTES } from '../components/constants';
// import { formatCompactNumber } from '../utils/formatters';

export const AllBlogs = ({ initialPage = DEFAULT_PAGE, pageSize = DEFAULT_PAGE_SIZE }) => {
  const dispatch = useDispatch();
  const { blogs = [], loading } = useSelector((state) => state.blog);

  useEffect(() => {
    dispatch(fetchBlogs({ page: initialPage, limit: pageSize }));
  }, [dispatch, initialPage, pageSize]);

  return (
    <div className="min-h-screen bg-base-200 py-20">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Premium Header */}
        <header className="text-center mb-24">
          <h1 className="text-6xl lg:text-7xl font-extrabold bg-linear-to-r from-teal-500 to-blue-600 bg-clip-text text-transparent mb-8">
            Discover Stories
          </h1>
          <p className="text-2xl text-base-content/70 max-w-4xl mx-auto leading-relaxed">
            Immerse yourself in thoughtful writing, personal journeys, and creative ideas from our passionate community of writers.
          </p>
        </header>

        <div className="flex items-center justify-between mb-8">
          <div className="text-sm text-gray-500">Showing {blogs?.length} stories</div>
          <Link to={ROUTES.CREATE_BLOG} className="btn btn-outline btn-sm">
            Write a Story
          </Link>
        </div>

        <HorizontalBlogList blogs={blogs} loading={loading} />
      </div>
    </div>
  );
};

AllBlogs.propTypes = {
  initialPage: PropTypes.number,
  pageSize: PropTypes.number,
};