import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { HorizontalBlogList } from "../components/UI/blog/HorizontalBlogList";
import { fetchBlogs } from "../store/features/blogSlice";

export const AllBlogs = () => {
  const dispatch = useDispatch();
  const { blogs, loading } = useSelector((state) => state.blog);

  useEffect(() => {
    dispatch(fetchBlogs({ page: 1, limit: 10 }));
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-base-200 py-16">
      <div className="container mx-auto px-4 max-w-7xl">

        {/* HEADER */}
        <div className="text-center mb-20">
          <h1 className="text-6xl font-extrabold bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent">
            Latest Stories
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-xl text-base-content/70">
            Discover meaningful stories and ideas shared by creators.
          </p>
        </div>

        <HorizontalBlogList blogs={blogs} loading={loading} />
      </div>
    </div>
  );
};