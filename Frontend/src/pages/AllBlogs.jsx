import React from 'react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBlogs } from '../store/features/blogSlice';
import { BlogList } from '../components/UI/blog/BlogList';
// import { Loading } from '../components/feedback/Loading';

export const AllBlogs = () => {
  const dispatch = useDispatch();
  const { blogs, loading, error } = useSelector((state) => state.blog);

  useEffect(() => {
    dispatch(fetchBlogs({ page: 1, limit: 12 }));
  }, [dispatch]);

  if (error) return <div className="text-center py-10 text-red-500">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center">All Blogs</h1>
      <BlogList blogs={blogs} loading={loading} />
    </div>
  );
};