import React from "react";
import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { FiCamera, FiX } from "react-icons/fi";
import toast from "react-hot-toast";
import { ALLOWED_IMAGE_TYPES, MAX_FILE_SIZE } from "../../constants/index";

export const AvatarUpload = ({
  avatarPreview,
  setAvatarPreview,
  setAvatarFile,
  username,
  disabled = false,
}) => {
  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;

    // Type validation
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      toast.error("Only JPG, PNG, WEBP images are allowed");
      return;
    }

    if (file.size > MAX_FILE_SIZE.AVATAR) {
      toast.error("Avatar must be less than 2MB");
      return;
    }

    setAvatarFile(file);
    
    const reader = new FileReader();
    reader.onloadend = () => setAvatarPreview(reader.result);
    reader.readAsDataURL(file);
  }, [setAvatarFile, setAvatarPreview]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    multiple: false,
    disabled,
  });

  const removeAvatar = (e) => {
    e.stopPropagation();
    setAvatarFile(null);
    setAvatarPreview(null);
  };

  return (
    <div
      {...getRootProps()}
      className={`avatar cursor-pointer transition-all ${
        isDragActive ? "scale-110 ring-4 ring-primary ring-offset-4" : ""
      }`}
    >
      <input {...getInputProps()} />

      <div className="w-32 md:w-40 rounded-full ring ring-primary ring-offset-base-100 ring-offset-4 relative overflow-hidden">
        {avatarPreview ? (
          <img src={avatarPreview} className="object-cover w-full h-full" />
        ) : (
          <div className="w-full h-full bg-primary text-white flex items-center justify-center text-4xl font-bold">
            {username?.[0]?.toUpperCase()}
          </div>
        )}

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/60 opacity-0 hover:opacity-100 transition-opacity flex flex-col items-center justify-center">
          <FiCamera className="h-8 w-8 text-white mb-2" />
          <span className="text-white text-xs">
            {isDragActive ? "Drop here" : "Click or drag"}
          </span>
        </div>
        {avatarPreview && (
          <button
            type="button"
            onClick={removeAvatar}
            className="absolute top-2 right-2 btn btn-circle btn-sm btn-error"
          >
            <FiX className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
};

export default AvatarUpload;