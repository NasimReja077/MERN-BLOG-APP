import React from "react";
import HorizontalBlogCard from "./HorizontalBlogCard";
import { Link } from "react-router-dom";

export const HorizontalBlogList = ({ blogs = [], loading = false }) => {
  if (loading) {
    return (
      <div className="space-y-20">
        {[1, 2, 3].map((i) => (
          <div key={i} className="grid grid-cols-1 md:grid-cols-12 rounded-3xl overflow-hidden bg-base-200 animate-pulse">
            <div className="md:col-span-5 aspect-4/3 md:aspect-auto bg-base-300" />
            <div className="md:col-span-7 p-10 space-y-8">
              <div className="h-8 w-48 bg-base-300 rounded-full" />
              <div className="space-y-4">
                <div className="h-12 bg-base-300 rounded-xl" />
                <div className="h-12 w-11/12 bg-base-300 rounded-xl" />
              </div>
              <div className="h-24 bg-base-300 rounded-xl" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (blogs.length === 0) {
    return (
      <div className="py-32 text-center">
        <h3 className="text-5xl font-bold text-base-content/60 mb-6">No stories yet</h3>
        <p className="text-2xl text-base-content/50 mb-10">Be the first to share your voice</p>
        <Link to="/blogs/create" className="btn btn-primary btn-lg text-xl px-12 py-5">
          Write Your Story
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-24">
      {blogs.map((blog) => (
        <HorizontalBlogCard key={blog._id} blog={blog} />
      ))}
    </div>
  );
};