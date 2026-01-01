// Frontend/src/pages/Profile
// import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { Loading } from "../components/feedback/Loading";
import { ImBlog } from "react-icons/im";
import { formatDate } from "../utils/formatters";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchUserBlogs } from "../store/features/blogSlice";
import { BlogList } from "../components/UI/blog/BlogList";
import { ROUTES } from "../components/constants";

export const Profile = () => {
  const dispatch = useDispatch();
  // const { user, loading: authLoading } = useAuth();
  const { user, loading: authLoading } = useAuth();
  const { blogs: userBlogs, loading: blogsLoading } = useSelector((state) => state.blog);

  useEffect(() => {
    if (user?._id){
      dispatch(fetchUserBlogs({ userId: user._id, params: { limit: 10 }}));
    }
  }, [user?._id, dispatch]);

  // Optional: fetch latest profile if needed
  // useEffect(() => {
  //   dispatch(getProfile());
  // }, [dispatch]);

  if (authLoading) {
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
                    className="object-cover"
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
                  <span>Member since {formatDate(user.createdAt)}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex justify-center md:justify-end">
              <Link to={ROUTES.UPDATE_PROFILE} className="btn btn-primary btn-lg">
                Edit Profile
              </Link>
            </div>
          </div>
        </div>

        {/* Stats or Blogs Section */}
        <section className="mt-1">
          <h2 className="text-3xl font-bold text-center mb-8">Your Blogs</h2>

          {blogsLoading ? (
            <Loading />
          ): userBlogs.length > 0 ? (
            <BlogList blogs={userBlogs} />
          ): (
            <div className="text-center py-16 bg-base-100 rounded-2xl shadow">
              <p className="text-base-content/60 mb-6">You haven't published any blogs yet.</p>
              <Link to={ROUTES.CREATE_BLOG} className="btn btn-primary">
                Write Your First Blog
              </Link>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};