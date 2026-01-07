import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { profileUpdateSchema } from "../utils/validation";
import { updateProfile } from "../store/features/authSlice";
import { Loading } from "../components/feedback/Loading";
import { ROUTES, TOAST_MESSAGES } from "../components/constants/index";
import { AvatarUpload } from "../components/UI/profile/AvatarUpload";
import { CoverUpload } from "../components/UI/profile/CoverUpload";
import { FiSave } from "react-icons/fi";
import { IoMdArrowBack } from "react-icons/io";

export const UpdateProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loading } = useSelector((state) => state.auth);

  // Image states
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const [coverFile, setCoverFile] = useState(null);

  // React Hook Form
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(profileUpdateSchema),
    defaultValues: {
      fullName: "",
      bio: "",
      address: "",
      mobile: "",
      aadhar: "",
    },
  });

  // Load user data
  useEffect(() => {
    if (!user) return;

    reset({
      fullName: user.fullName || "",
      bio: user.bio || "",
      address: user.address || "",
      mobile: user.mobile || "",
      aadhar: user.aadhar || "",
    });

    setAvatarPreview(user.avatar || null);
    setCoverPreview(user.coverImage || null);
  }, [user, reset]);

  // Submit handler
  const onSubmit = async (data) => {
    try {
      const formData = new FormData();

      // Text fields
      Object.entries(data).forEach(([key, value]) => {
        if (value) formData.append(key, value);
      });

      // Files
      if (avatarFile) formData.append("avatar", avatarFile);
      if (coverFile) formData.append("coverImage", coverFile);

      await dispatch(updateProfile(formData)).unwrap();
      toast.success(TOAST_MESSAGES.PROFILE_UPDATED);
      navigate(ROUTES.PROFILE);
    } catch (error) {
      toast.error(error?.message || TOAST_MESSAGES.UPDATE_FAILED);
    }
  };

  // Loading / error states
  if (loading && !user) return <Loading fullScreen />;

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

        {/* Header */}
        <div className="bg-base-100 rounded-2xl shadow-xl p-6 mb-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(ROUTES.PROFILE)}
              className="btn btn-circle btn-ghost btn-sm"
            >
              <IoMdArrowBack className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-3xl font-extrabold">Edit Profile</h1>
              <p className="text-sm text-base-content/60">
                Update your profile information
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="bg-base-100 rounded-2xl shadow-xl overflow-hidden">

            {/* Cover Upload */}
            <CoverUpload
              coverPreview={coverPreview}
              setCoverPreview={setCoverPreview}
              setCoverFile={setCoverFile}
              disabled={loading}
            />

            {/* Avatar Upload */}
            <div className="relative px-6 pb-10 pt-20 md:pt-24">
              <div className="absolute -top-16 left-1/2 -translate-x-1/2 md:left-10 md:translate-x-0">
                <AvatarUpload
                  avatarPreview={avatarPreview}
                  setAvatarPreview={setAvatarPreview}
                  setAvatarFile={setAvatarFile}
                  username={user.username}
                  disabled={loading}
                />
              </div>

              {/* Form Fields */}
              <div className="md:ml-52 lg:ml-60 mt-8 md:mt-0 space-y-6">

                {/* Username */}
                <div className="form-control">
                  <label className="label font-semibold">Username</label>
                  <input
                    value={user.username}
                    disabled
                    className="input input-bordered bg-base-200"
                  />
                </div>

                {/* Email */}
                <div className="form-control">
                  <label className="label font-semibold">Email</label>
                  <input
                    value={user.email}
                    disabled
                    className="input input-bordered bg-base-200"
                  />
                </div>

                {/* Full Name */}
                <div className="form-control">
                  <label className="label font-semibold">Full Name</label>
                  <input
                    {...register("fullName")}
                    className="input input-bordered"
                    disabled={loading}
                  />
                  {errors.fullName && (
                    <span className="text-error text-sm">
                      {errors.fullName.message}
                    </span>
                  )}
                </div>

                {/* Bio */}
                <div className="form-control">
                  <label className="label font-semibold">Bio</label>
                  <textarea
                    {...register("bio")}
                    className="textarea textarea-bordered h-24"
                    disabled={loading}
                  />
                  {errors.bio && (
                    <span className="text-error text-sm">
                      {errors.bio.message}
                    </span>
                  )}
                </div>

                {/* Address */}
                <div className="form-control">
                  <label className="label font-semibold">Address</label>
                  <input
                    {...register("address")}
                    className="input input-bordered"
                    disabled={loading}
                  />
                </div>

                {/* Mobile */}
                <div className="form-control">
                  <label className="label font-semibold">Mobile</label>
                  <input
                    {...register("mobile")}
                    maxLength={10}
                    className="input input-bordered"
                    disabled={loading}
                  />
                </div>

                {/* Aadhar */}
                <div className="form-control">
                  <label className="label font-semibold">Aadhar</label>
                  <input
                    {...register("aadhar")}
                    maxLength={12}
                    className="input input-bordered"
                    disabled={loading}
                  />
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-4 pt-6">
                  <button
                    type="button"
                    onClick={() => navigate(ROUTES.PROFILE)}
                    className="btn btn-ghost"
                    disabled={loading}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="btn btn-primary gap-2"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="loading loading-spinner loading-sm" />
                        Updating...
                      </>
                    ) : (
                      <>
                        <FiSave />
                        Save Changes
                      </>
                    )}
                  </button>
                </div>

              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};