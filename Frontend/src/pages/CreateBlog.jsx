// Frontend/src/pages/CreateBlog.jsx
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { blogSchema } from '../utils/validation';
import { LuSaveAll } from "react-icons/lu";
import { BsSendFill } from "react-icons/bs";
import { FaPlus } from "react-icons/fa";
import { IoIosClose } from "react-icons/io";
import toast from 'react-hot-toast';
import { ROUTES, TOAST_MESSAGES } from '../components/constants';
// import { object } from 'zod';
import { ThumbnailUploader } from '../components/UI/thumbnail/ThumbnailUploader';
import { RichTextEditor } from '../components/UI/editor/RichTextEditor';
import { createBlog } from '../store/features/blogSlice';

export const CreateBlog = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.blog);
  // const [status, setStatus] = useState("published");


  const {
    register,
    handleSubmit,
    setValue,
    watch,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(blogSchema),
    defaultValues: {
      status: 'published', 
      tags: [],
      thumbnail: null,
      content: '', 
    },
  });

  const thumbnail = watch("thumbnail");
  const tags = watch("tags") || [];
  const [tagInput, setTagInput] = useState("");

  // Add tag
  const addTag = () => {
    const trimmed = tagInput.trim();
    if (!trimmed) return;

    if (tags.includes(trimmed)){
      setError("tags", { message: "Tag already Added"});
      return;
    }

    if (trimmed.length > 20){
      setError("tags", {message: "Tag too long (max 20 chars)"});
      return;
    }

    const newTags = [...tags, trimmed];
    setValue("tags", newTags, { shouldValidate: true });
    setTagInput("");
    clearErrors("tags");
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter"){
      e.preventDefault();
      addTag();
    }
  };

  // Remove tag
  const removeTag = (indexToRemove) => {
    const newTags = tags.filter((_, index) => index !== indexToRemove);
    setValue("tags", newTags, { shouldValidate: true });
  };

  // Handle status change
  const handleStatusChange = (newStatus) => {
    setValue('status', newStatus, { shouldValidate: true });
  };

  const onSubmit = async(data) => {
    try {
      const formData = new FormData();

      // Append text fields
      formData.append('title', data.title);
      formData.append('content', data.content);
      formData.append('status', data.status);

      if (data.summary) {
        formData.append('summary', data.summary);
      }
      
      if (data.category) {
        formData.append('category', data.category);
      }

      // Append tags as JSON string or individually
      if (data.tags && data.tags.length > 0) {
        data.tags.forEach(tag => {
          formData.append('tags[]', tag);
        });
      }

      // Append thumbanl file
      if (data.thumbnail){
        formData.append('thumbnail', data.thumbnail);
      }

      // object.entries(data).forEach(([key, value]) => {
      //   if (value !== undefined && value !== null) {
      //     formData.append(key, value);
      //   }
      // });

      await dispatch(createBlog(formData)).unwrap();
      toast.success(TOAST_MESSAGES.BLOG_CREATED);
      navigate(ROUTES.HOME);
    } catch (error) {
      toast.error(error?.message || TOAST_MESSAGES.BLOG_CREATE_FAILED);
    }
  };

  return (
    <div className="min-h-screen bg-base-200 py-12 px-4">
      <div className="max-w-5xl mx-auto bg-white p-8 rounded-xl shadow-md">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-extrabold text-black">
              Create New Blog Post
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Write and publish a new blog post
            </p>
          </div>
          <div className="flex gap-2">
            <button 
              type='button'
              onClick={() => handleStatusChange('draft')}
              disabled={loading}
             className="btn btn-outline btn-secondary btn-md gap-2">
              <LuSaveAll className=" h-4 w-4 mr-2" />
              Save Draft
            </button>
            <button 
              type='button'
              onClick={() => handleStatusChange('published')}
              disabled={loading}
              className="btn btn-primary btn-md gap-2">
              <BsSendFill className="h-4 w-4 mr-2" />
              Publish
            </button>
          </div>
        </div>

        <form 
        id="create-blog" 
        onSubmit={handleSubmit(onSubmit)} 
        className="space-y-6">
          {/* Title */}
          <div>
            <label className="label font-semibold text-black">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              {...register('title')}
              type="text"
              disabled={loading}
              placeholder="Enter post title..."
              className="input input-bordered w-full"
            />
            {errors.title && (
              <p className='text-error text-sm mt-1'>{errors.title.message}</p>
            )}
          </div>
          {/* Summary */}
          <div>
            <label className="label font-semibold text-black">
              Content Summary
            </label>
            <textarea
              {...register('summary')}
              placeholder="Short summary of your blog"
              className="textarea textarea-bordered w-full"
              rows={3}
              disabled={loading}
            />
            {errors.summary && (
              <p className='text-error text-sm mt-1'>{errors.summary.message}</p>
            )}
          </div>
          {/* Thumbnail */}
          <ThumbnailUploader
          value={thumbnail}
          error={errors.thumbnail?.message} 
          loading={loading}
          onChange={(file) => 
            setValue("thumbnail", file, { shouldValidate: true })}
          />
          {/*Content*/}
          <div>
            <label className="label font-semibold text-black">
              Content <span className="text-red-500">*</span>
            </label>

            <RichTextEditor
              onChange={(value) => setValue("content", value, { shouldValidate: true })}
              error={errors.content?.message}
            />
            {/* {errors.content && (
              <p className="text-error text-sm mt-1">{errors.content.message}</p>
              )} */}

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
                    {...register('category')}
                    // defaultValue="Pick a category"
                    disabled={loading}
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
                  {/* <span className="label">Optional</span> */}
                </fieldset>
              </div>
              
              {/* Tags */}
              <div>
                <label className="label font-semibold">Tags</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="input input-bordered flex-1"
                    placeholder="Add tag..."
                    disabled={loading}
                  />
                  <button type="button" onClick={addTag} disabled={loading} className="btn btn-outline">
                    <FaPlus className="h-4 w-4" />
                  </button>
                </div>
                {errors.tags && (
                  <p className='text-error text-sm mt-1'>
                    {errors.tags.message}
                  </p>
                )}
                {/* Tag Preview */}
                <div className="flex flex-wrap gap-2 mt-3">
                  {tags.map((tag, index) => (
                    <span key={index} className="badge badge-primary gap-1">
                    {tag}
                    <button
                    type='button'
                    onClick={() => removeTag(index)}
                    className="hover:bg-primary-focus rounded-full"
                    disabled={loading}
                    >
                      <IoIosClose className="h-3 w-3 cursor-pointer " />
                    </button>
                  </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-4">
            <button
            type='button'
            onClick={() => navigate(ROUTES.HOME)}
            className='btn btn-ghost'
            disabled={loading}
            >
              Cancel
            </button>
            <button
            type='submit'
            className='btn btn-primary'
            disabled={loading}
            >
              {loading ? (
                <>
                <span className='loading loading-spinner loading-sm'></span>
                Creating...
                </>
              ): (
                'Create Blog'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
