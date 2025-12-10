// // import React, { useEffect } from 'react'
// // 💡 Import useDispatch here
// import { useSelector } from 'react-redux';
// import { BlogList } from '../components/UI/blog/BlogList';
// // 💡 Import fetchBlogs from the slice file
// // import { fetchBlogs } from '../store/features/blogSlice'; // Assuming the slice is in '../features/blogSlice'

// function Home() {
// // 👇 Use useDispatch
// // const dispatch = useDispatch();
// const { blogs, loading } = useSelector((state) => state.blog);

// // Fetch blogs when the component mounts or filters change
// // useEffect(() => {
// // // Dispatch the fetchBlogs action with the current filters
// // dispatch(fetchBlogs(filters));
// // }, [dispatch, filters]); // Re-fetch when filters change

//  return (
//  <div className="container mx-auto px-4 py-8">
//   {/* Blog List */}
//   <BlogList blogs={blogs} loading={loading} />
//   </div>
//  )
// }

// export default Home





// src/pages/Home.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { BlogList } from '../components/UI/blog/BlogList';
import { useAuth } from '../hooks/useAuth';

export const Home = () => {
  const { blogs, loading } = useSelector((state) => state.blog);
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="min-h-screen bg-amber-200">
      {/* Hero Section */}
      <section className="container mx-auto px-6 py-20 text-center">
        <h1 className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-blue-400">
          Your Story Matters
        </h1>
        <p className="text-xl md:text-2xl text-gray-700 mb-10 max-w-3xl mx-auto">
          Join a community of writers sharing ideas, experiences, and knowledge. Start writing today.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {isAuthenticated ? (
            <>
              <Link
                to="/blogs/create"
                className="btn btn-lg btn-primary shadow-lg hover:shadow-xl transform hover:scale-105 transition"
              >
                Write Your First Blog
              </Link>
              <Link
                to="/blogs"
                className="btn btn-lg btn-outline border-2 hover:bg-primary hover:text-white transition"
              >
                Explore Blogs
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/signup"
                className="btn btn-lg btn-primary shadow-lg hover:shadow-xl transform hover:scale-105 transition"
              >
                Start Writing Free
              </Link>
              <Link
                to="/login"
                className="btn btn-lg btn-outline border-2 hover:bg-primary hover:text-white transition"
              >
                Login
              </Link>
            </>
          )}
        </div>

        {isAuthenticated && user && (
          <p className="mt-10 text-lg text-gray-600">
            Welcome back, <span className="font-bold text-primary">{user.username}</span>!
          </p>
        )}
      </section>

      {/* Featured Blogs */}
      <section className="container mx-auto px-6 pb-20">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800">Latest Blogs</h2>
          <p className="text-gray-600 mt-2">Discover stories from our community</p>
        </div>

        <BlogList blogs={blogs} loading={loading} />

        {blogs.length > 0 && (
          <div className="text-center mt-12">
            <Link
              to="/blogs"
              className="inline-block px-8 py-4 bg-primary text-white rounded-full font-medium hover:bg-primary/90 transition"
            >
              View All Blogs →
            </Link>
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;