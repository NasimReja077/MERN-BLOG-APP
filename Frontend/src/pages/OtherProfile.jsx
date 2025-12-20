
import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { Loading } from "../components/feedback/Loading";
import { ImBlog } from "react-icons/im";

export const OtherProfile = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <Loading fullScreen />;
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-error text-xl">Unable to load profile</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Profile Card */}
        <div className="bg-base-100 rounded-2xl shadow-xl overflow-hidden">
          {/* Cover Image */}
          {user.coverImage ? (
            <div className="h-48 md:h-64 overflow-hidden">
              <img src={user.coverImage} alt="Cover" className="w-full h-full object-cover" />
            </div>
          ) : (
            <div className="h-48 md:h-64 bg-linear-to-r from-primary to-secondary"></div>
          )}

          <div className="relative px-6 pb-10 pt-20 md:pt-24">
            {/* Avatar */}
            <div className="absolute -top-16 left-1/2 -translate-x-1/2 md:left-10 md:translate-x-0">
              <div className="avatar">
                <div className="w-32 md:w-40 rounded-full ring ring-primary ring-offset-base-100 ring-offset-4">
                  <img
                    src={user.avatar || "/default-avatar.png"}
                    alt={user.username}
                  />
                </div>
              </div>
            </div>

            {/* User Info */}
            <div className="text-center md:text-left md:ml-52 lg:ml-60 mt-8 md:mt-0">
              <h1 className="text-3xl md:text-4xl font-bold">{user.fullName || user.username}</h1>
              <p className="text-base-content/70 mt-2">@{user.username}</p>

              {user.bio && (
                <p className="mt-4 text-lg text-base-content/90 max-w-2xl">{user.bio}</p>
              )}

              <div className="flex flex-wrap gap-6 mt-6 text-base-content/70">
                {user.address && (
                  <div className="flex items-center gap-2">
                    <span>📍 {user.address}</span>
                  </div>
                )}
                {user.mobile && (
                  <div className="flex items-center gap-2">
                    <span>📞 {user.mobile}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <ImBlog className="size-5" />
                  <span>Member since {new Date(user.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex justify-center md:justify-end">
              <Link to="/profile/update" className="btn btn-primary btn-lg">
                Edit Profile
              </Link>
            </div>
          </div>
        </div>

        {/* Stats or Blogs Section */}
        <div className="mt-10 text-center">
          <h2 className="text-2xl font-bold mb-6">Your Blogs</h2>
          {/* You can add a BlogList here filtered by author */}
          <p className="text-base-content/60">Your published blogs will appear here.</p>
          <Link to="/blogs/create" className="btn btn-primary mt-6">
            Write New Blog
          </Link>
        </div>
      </div>
    </div>
  );
};