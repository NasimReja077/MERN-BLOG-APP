// Frontend/src/pages/EditBlog.jsx
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { blogSchema } from "../utils/validation";
import { LuSaveAll } from "react-icons/lu";
import { FaPlus, FaTrash } from "react-icons/fa";
import { IoIosClose, IoMdArrowBack } from "react-icons/io";
// import { FiUpload } from "react-icons/fi";
import toast from "react-hot-toast";
import { TOAST_MESSAGES, ROUTES } from "../components/constants";
import { ThumbnailUploader } from "../components/UI/thumbnail/ThumbnailUploader";
import { RichTextEditor } from "../components/UI/editor/RichTextEditor";
import {
  fetchBlogById,
  updateBlog,
  deleteBlog,
} from "../store/features/blogSlice";
import { uploadThumbnail } from "../store/features/thumbnailSlice";
import { Loading } from "../components/feedback/Loading";
import Swal from "sweetalert2";

export const EditBlog = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { currentBlog, loading } = useSelector((state) => state.blog);
  const { uploading } = useSelector((state) => state.thumbnail);
  const { user } = useSelector((state) => state.auth);

  const [tagInput, setTagInput] = useState("");
  const [newThumbnail, setNewThumbnail] = useState(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    setError,
    clearErrors,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(blogSchema),
    defaultValues: {
      status: "published",
      tags: [],
    },
  });

  const tags = watch("tags") || [];

  // Load blog data
  useEffect(() => {
    if (id) {
      dispatch(fetchBlogById(id));
    }
  }, [id, dispatch]);

  // Populate form when blog loads
  useEffect(() => {
    if (currentBlog) {
      // Check if user owns this blog
      if (currentBlog.author?._id !== user?._id) {
        toast.error("You can only edit your own blogs");
        navigate(ROUTES.HOME);
        return;
      }

      reset({
        title: currentBlog.title || "",
        content: currentBlog.content || "",
        summary: currentBlog.summary || "",
        category: currentBlog.category || "",
        tags: currentBlog.tags || [],
        status: currentBlog.status || "published",
      });
    }
  }, [currentBlog, reset, user, navigate]);



  // Tag management
  const addTag = () => {
    const trimmed = tagInput.trim();
    if (!trimmed) return;

    if (tags.includes(trimmed)) {
      setError("tags", { message: "Tag already added" });
      return;
    }

    if (trimmed.length > 20) {
      setError("tags", { message: "Tag too long (max 20 chars)" });
      return;
    }

    const newTags = [...tags, trimmed];
    setValue("tags", newTags, { shouldValidate: true });
    setTagInput("");
    clearErrors("tags");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    }
  };

  const removeTag = (indexToRemove) => {
    const newTags = tags.filter((_, index) => index !== indexToRemove);
    setValue("tags", newTags, { shouldValidate: true });
  };

  // Handle thumbnail update separately
  const handleThumbnailUpload = async () => {
    if (!newThumbnail) {
      toast.error("Please select a thumbnail first");
      return;
    }

    try {
      await dispatch(
        uploadThumbnail({
          blogId: id,
          file: newThumbnail,
        })
      ).unwrap();

      setNewThumbnail(null);
      toast.success("Thumbnail updated successfully");
      // Refresh blog data to show new thumbnail
      dispatch(fetchBlogById(id));
    } catch (error) {
      toast.error(error?.message || "Failed to upload thumbnail");
    }
  };

  // Update blog text content
  const onSubmit = async (data) => {
    try {
      const formData = new FormData();

      // Text fields only (no images in main update)
      formData.append("title", data.title);
      formData.append("content", data.content);
      formData.append("status", data.status);

      if (data.summary) {
        formData.append("summary", data.summary);
      }

      if (data.category) {
        formData.append("category", data.category);
      }

      // Tags
      if (data.tags && data.tags.length > 0) {
        data.tags.forEach((tag) => {
          formData.append("tags[]", tag);
        });
      }

      await dispatch(updateBlog({ id, formData })).unwrap();
      toast.success(TOAST_MESSAGES.BLOG_UPDATED);
      navigate(`/blogs/${id}`);
    } catch (error) {
      toast.error(error?.message || TOAST_MESSAGES.BLOG_UPDATE_FAILED);
    }
  };

  // Handle blog deletion
  const handleDelete = async () => {
    const result = await Swal.fire({
      title: "Delete Blog?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        await dispatch(deleteBlog(id)).unwrap();
        toast.success(TOAST_MESSAGES.BLOG_DELETED);
        navigate(ROUTES.HOME);
      } catch (error) {
        toast.error(error?.message || TOAST_MESSAGES.BLOG_DELETE_FAILED);
      }
    }
  };

  if (loading && !currentBlog) {
    return <Loading fullScreen />;
  }

  if (!currentBlog) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-200">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-error mb-4">Blog Not Found</h2>
          <button
            onClick={() => navigate(ROUTES.HOME)}
            className="btn btn-primary"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200 py-12 px-4">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header Card */}
        <div className="bg-base-100 p-6 rounded-xl shadow-md">
          <div className="flex justify-between items-start gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <button
                  onClick={() => navigate(`/blogs/${id}`)}
                  className="btn btn-circle btn-ghost btn-sm"
                >
                  <IoMdArrowBack className="h-5 w-5" />
                </button>
                <h1 className="text-3xl font-extrabold text-base-content">
                  Edit Blog Post
                </h1>
              </div>
              <p className="text-sm text-base-content/60 ml-12">
                Update your blog content and settings
              </p>
            </div>

            {/* Quick Actions */}
            <div className="flex gap-2">
              <button
                onClick={() => navigate(`/blogs/${id}`)}
                className="btn btn-ghost btn-sm"
              >
                Preview
              </button>
              <button
                onClick={handleDelete}
                className="btn btn-error btn-sm gap-2"
                disabled={loading || uploading}
              >
                <FaTrash className="h-4 w-4" />
                Delete
              </button>
            </div>
          </div>
        </div>

        <div className="bg-base-100 p-8 rotate-xl shadow-md">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Title */}
            <div>
              <label className="label font-semibold text-black">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                {...register("title")}
                type="text"
                disabled={loading}
                placeholder="Enter post title..."
                className="input input-bordered w-full"
                disabled={loading || uploading}
              />
              {errors.title && (
                <p className="text-error text-sm mt-1">
                  {errors.title.message}
                </p>
              )}
            </div>

            {/* Summary */}
            <div>
              <label className="label font-semibold text-black">
                Content Summary
              </label>
              <textarea
                {...register("summary")}
                placeholder="Short summary of your blog"
                className="textarea textarea-bordered w-full"
                rows={3}
                disabled={loading || uploading}
              />
              {errors.summary && (
                <p className="text-error text-sm mt-1">
                  {errors.summary.message}
                </p>
              )}
            </div>

            {/* Current Thumbnail Preview */}
            {currentBlog.thumbnail && !newThumbnail && (
              <div className="relative h-64 sm:h-80 rounded-2xl overflow-hidden mb-4">
                <img
                  src={currentBlog.thumbnail}
                  alt="Current thumbnail"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                  <p className="text-white text-lg font-medium">
                    Current Thumbnail
                  </p>
                </div>
              </div> // Added this closing tag
            )}
            {/* Thumbnail */}
            <ThumbnailUploader
              value={newThumbnail}
              onChange={setNewThumbnail}
              loading={uploading}
            />

             {/* Upload New Thumbnail Button */}
            {newThumbnail && (
              <div className="mt-4 flex justify-end">
                <button
                type="button"
                onClick={handleThumbnailUpload}
                disabled={uploading}
                className="btn btn-secondary gap-2"
                >{uploading ? (
                  <>
                    <span className="loading loading-spinner loading-sm"></span>
                    Uploading...
                  </>
                ) : (
                  <>
                    {/* <FiCamera className="h-4 w-4" /> */}
                    Upload New Thumbnail
                  </>
                )}

                </button>

              </div>
            )}
            {/*Content*/}
            <div>
              <label className="label font-semibold text-black">
                Content <span className="text-red-500">*</span>
              </label>

              <RichTextEditor
                value={currentBlog.content}
                onChange={(value) =>
                  setValue("content", value, { shouldValidate: true })
                }
                error={errors.content?.message}
              />
            </div>
            {/* Settings */}
            <div className="bg-base-200 rounded-xl p-6 space-y-4">
              <h2 className="text-xl font-bold">Post Settings</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/**Category */}
                <div>
                  <fieldset className="fieldset">
                    <legend className="label font-semibold">Category</legend>
                    <select
                      {...register("category")}
                      disabled={loading || uploading}
                      className="select select-bordered w-full"
                    >
                      <option value="">Select a category</option>
                      <option>Technology</option>
                      <option>Gaming</option>
                      <option>Health</option>
                      <option>Travel</option>
                      <option>Art</option>
                      <option>UI/UX</option>
                      <option>Food</option>
                      <option>Programming</option>
                    </select>
                  </fieldset>
                </div>

                {/* Status */}
                <div>
                  <label className="label font-semibold">Status</label>
                  <select
                    {...register("status")}
                    className="select select-bordered w-full"
                    disabled={loading || uploading}
                  >
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>

                {/* Tags */}
                <div className="md:col-span-2">
                  <label className="label font-semibold">Tags</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      className="input input-bordered flex-1"
                      placeholder="Add tag..."
                      disabled={loading || uploading}
                    />
                    <button
                      type="button"
                      onClick={addTag}
                      disabled={loading || uploading}
                      className="btn btn-outline"
                    >
                      <FaPlus className="h-4 w-4" />
                    </button>
                  </div>
                  {errors.tags && (
                    <p className="text-error text-sm mt-1">
                      {errors.tags.message}
                    </p>
                  )}
                  {/* Tag Preview */}
                  <div className="flex flex-wrap gap-2 mt-3">
                    {tags.map((tag, index) => (
                      <span key={index} className="badge badge-primary gap-1">
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(index)}
                          className="hover:bg-primary-focus rounded-full"
                          disabled={loading || uploading}
                        >
                          <IoIosClose className="h-3 w-3 cursor-pointer " />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            {/* Submit Buttons */}
            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={() => navigate(`/blogs/${id}`)}
                className="btn btn-ghost"
                disabled={loading || uploading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading || uploading}
              >
                {loading ? (
                  <>
                    <span className="loading loading-spinner loading-sm"></span>
                    Updating...
                  </>
                ) : (
                  <>
                    <LuSaveAll className="h-4 w-4" />
                    Update Blog
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
