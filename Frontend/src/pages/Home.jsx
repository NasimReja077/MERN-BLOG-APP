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
import { Loading } from '../components/feedback/Loading';

export const Home = () => {
  const { blogs, loading } = useSelector((state) => state.blog);
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="min-h-screen bg-amber-50">
      {/* Hero */}
      <section className="container mx-auto px-6 py-20 text-center">
        <h1 className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-purple-600">
          Your Story Matters
        </h1>
        <p className="text-xl md:text-2xl text-gray-700 mt-6 mb-10 max-w-3xl mx-auto">
          Join a community of writers sharing ideas, experiences, and knowledge.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {isAuthenticated ? (
            <>
              <Link to="/blogs/create" className="btn btn-lg btn-primary">
                Write Your First Blog
              </Link>
              <Link to="/blogs" className="btn btn-lg btn-outline">
                Explore Blogs
              </Link>
            </>
          ) : (
            <>
              <Link to="/signup" className="btn btn-lg btn-primary">
                Start Writing Free
              </Link>
              <Link to="/login" className="btn btn-lg btn-outline">
                Login
              </Link>
            </>
          )}
        </div>

        {isAuthenticated && user && (
          <p className="mt-10 text-lg">
            Welcome back, <strong className="text-primary">{user.username}</strong>!
          </p>
        )}
      </section>

      {/* Latest Blogs */}
      <section className="container mx-auto px-6 pb-20">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800">Latest Blogs</h2>
          <p className="text-gray-600 mt-2">Discover stories from our community</p>
        </div>

        {loading ? (
          <Loading />
        ) : blogs.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">No blogs yet. Be the first to write one!</p>
          </div>
        ) : (
          <BlogList blogs={blogs} loading={false} />
        )}

        {blogs.length > 0 && (
          <div className="text-center mt-12">
            <Link to="/blogs" className="btn btn-primary">
              View All Blogs
            </Link>
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;