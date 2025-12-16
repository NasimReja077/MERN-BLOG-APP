import { Link } from "react-router-dom";
import {
  FiHeart,
  FiEye,
  FiMessageCircle,
  FiClock,
  FiTag,
} from "react-icons/fi";
import { formatDistanceToNow } from "date-fns";

const HorizontalBlogCard = ({ blog }) => {
  const likeCount = blog.likeCount || blog.likes?.count || 0;
  const viewCount = blog.viewCount || blog.views?.count || 0;
  const commentsCount = blog.commentsCount || 0;
  const tags = blog.tags || [];

  return (
    <article className="group relative overflow-hidden rounded-3xl bg-base-100 border border-base-300 shadow-md transition-all duration-300 hover:shadow-xl">
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[420px]">

        {/* LEFT CONTENT */}
        <div className="lg:col-span-7 p-8 lg:p-12 flex flex-col justify-between">

          {/* STATS */}
          <div className="flex flex-wrap gap-6 text-sm text-base-content/60">
            <Stat icon={<FiHeart />} value={likeCount} label="Likes" color="text-red-500" />
            <Stat icon={<FiEye />} value={viewCount} label="Views" color="text-blue-500" />
            <Stat
              icon={<FiMessageCircle />}
              value={commentsCount}
              label="Comments"
              color="text-green-500"
            />
          </div>

          {/* CATEGORY + DATE */}
          <div className="mt-6 flex flex-wrap items-center gap-4 text-sm">
            {blog.category && (
              <span className="rounded-full bg-primary/10 px-5 py-2 font-semibold text-primary">
                {blog.category}
              </span>
            )}
            <span className="flex items-center gap-2 text-base-content/50">
              <FiClock />
              {formatDistanceToNow(new Date(blog.createdAt), {
                addSuffix: true,
              })}
            </span>
          </div>

          {/* TITLE */}
          <Link to={`/blogs/${blog._id}`}>
            <h2 className="mt-6 text-3xl lg:text-4xl font-extrabold leading-tight line-clamp-3 transition-colors group-hover:text-primary">
              {blog.title}
            </h2>
          </Link>

          {/* SUMMARY */}
          {blog.summary && (
            <p className="mt-4 text-lg text-base-content/75 leading-relaxed line-clamp-4">
              {blog.summary}
            </p>
          )}

          {/* AUTHOR + TAGS */}
          <div className="mt-8 flex flex-wrap items-center justify-between gap-6">

            {/* AUTHOR */}
            <Link
              to={`/other-user-profile/${blog.author?._id}`}
              className="flex items-center gap-4"
            >
              <img
                src={blog.author?.avatar || "/default-avatar.png"}
                alt={blog.author?.username}
                className="w-14 h-14 rounded-full object-cover ring-4 ring-primary/20"
              />
              <div>
                <p className="font-bold text-base-content">
                  {blog.author?.username}
                </p>
                <p className="text-sm text-base-content/50">
                  {blog.author?.fullName || "Writer"}
                </p>
              </div>
            </Link>

            {/* TAGS */}
            {tags.length > 0 && (
              <div className="flex flex-wrap items-center gap-3">
                <FiTag className="text-base-content/40" />
                {tags.slice(0, 3).map((tag, i) => (
                  <span
                    key={i}
                    className="rounded-full bg-base-200 px-4 py-1.5 text-sm font-medium text-base-content/70"
                  >
                    #{tag}
                  </span>
                ))}
                {tags.length > 3 && (
                  <span className="text-sm text-base-content/50">
                    +{tags.length - 3}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT IMAGE */}
        <Link
          to={`/blogs/${blog._id}`}
          className="lg:col-span-5 relative overflow-hidden"
        >
          <img
            src={blog.thumbnail || "https://via.placeholder.com/600x800"}
            alt={blog.title}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-linear-to-l from-black/60 via-black/20 to-transparent" />
        </Link>
      </div>
    </article>
  );
};

const Stat = ({ icon, value, label, color }) => (
  <div className="flex items-center gap-2">
    <span className={`${color} text-lg`}>{icon}</span>
    <span className="font-semibold">{value}</span>
    <span className="hidden sm:inline">{label}</span>
  </div>
);

export default HorizontalBlogCard;
