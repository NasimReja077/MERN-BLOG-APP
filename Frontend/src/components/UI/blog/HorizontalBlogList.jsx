import HorizontalBlogCard from "./HorizontalBlogCard";

export const HorizontalBlogList = ({ blogs = [], loading }) => {
  if (loading) {
    return (
      <div className="space-y-16">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="h-[420px] rounded-3xl bg-base-300 animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (!blogs.length) {
    return (
      <div className="py-24 text-center">
        <h3 className="text-4xl font-bold opacity-60">No blogs found</h3>
        <p className="mt-3 text-base-content/50">
          Start writing and share your thoughts ✍️
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-16">
      {blogs.map((blog) => (
        <HorizontalBlogCard key={blog._id} blog={blog} />
      ))}
    </div>
  );
};
