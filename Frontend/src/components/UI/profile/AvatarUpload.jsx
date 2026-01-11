import React, { useCallback } from "react";
import PropTypes from "prop-types";
import { useDropzone } from "react-dropzone";
import { FiCamera, FiX } from "react-icons/fi";
import toast from "react-hot-toast";
import { ALLOWED_IMAGE_TYPES, MAX_FILE_SIZE } from "../../constants/index";

export const AvatarUpload = ({
  avatarPreview,
  setAvatarPreview,
  setAvatarFile,
  username = "U",
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

    // Set the file for upload
    setAvatarFile(file);
    
    // Generate preview
    const reader = new FileReader();
    reader.onloadend = () => { 
      setAvatarPreview(reader.result); 
    };
    reader.onerror = () => {
      toast.error("Failed to read image file");
    };
    reader.readAsDataURL(file);
  }, [setAvatarFile, setAvatarPreview]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    multiple: false,
    disabled,
    maxSize: MAX_FILE_SIZE.AVATAR,
  });

  const removeAvatar = (e) => {
    e.stopPropagation();
    setAvatarFile(null);
    setAvatarPreview(null);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div
      {...getRootProps()}
      className={`avatar cursor-pointer transition-all duration-300
          ${isDragActive ? "scale-110" : "hover:scale-105"}
          ${disabled ? "opacity-50 cursor-not-allowed" : ""}
        `}
    >
      <input {...getInputProps()} />

       {/* Avatar Circle */}
      <div className={`
          w-32 h-32 md:w-40 md:h-40 rounded-full 
          ring-4 ring-offset-4 ring-offset-base-100
          ${isDragActive ? "ring-primary ring-offset-8" : "ring-primary"}
          relative overflow-hidden
          transition-all duration-300
        `}>
        {avatarPreview ? (
          <img src={avatarPreview} alt="Avatar preview" className="object-cover w-full h-full" />
        ) : (
          <div className="w-full h-full bg-primary text-white flex items-center justify-center text-4xl font-bold md:text-5xl">
            {username?.[0]?.toUpperCase() || "U"}
          </div>
        )}

        {/* Overlay */}
        <div className={`absolute inset-0 bg-black/60 opacity-0 hover:opacity-100 transition-opacity flex flex-col items-center justify-center duration-300 ${disabled ? "opacity-0" : "opacity-0 hover:opacity-100"}`}>
          <FiCamera className="h-8 w-8 text-white mb-2" />
          <span className="text-white text-xs font-medium px-2 text-center">
            {isDragActive ? "Drop here" : "Click or drag"}
          </span>
        </div>
         {/* Remove Button */}
        {avatarPreview && !disabled && (
          <button
            type="button"
            onClick={removeAvatar}
            aria-label="Remove avatar"
            className="absolute top-2 right-2 btn btn-circle btn-sm btn-error shadow-lg hover:scale-110 transition-transform z-10"
          >
            <FiX className="h-4 w-4" />
          </button>
        )}
      </div>
      </div>
       {/* Help Text */}
      <div className="text-center">
        <p className="text-sm text-base-content/70">
          JPG, PNG, WEBP • Max 2MB
        </p>
        {isDragActive && (
          <p className="text-sm text-primary font-medium mt-1 animate-pulse">
            Drop your image here...
          </p>
        )}
      </div>
    </div>
  );
};

export default AvatarUpload;

AvatarUpload.propTypes = {
  avatarPreview: PropTypes.string,
  setAvatarPreview: PropTypes.func.isRequired,
  setAvatarFile: PropTypes.func.isRequired,
  username: PropTypes.string,
  disabled: PropTypes.bool,
};