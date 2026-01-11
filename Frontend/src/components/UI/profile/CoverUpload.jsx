import React, { useCallback } from "react";
import PropTypes from "prop-types";
import { useDropzone } from "react-dropzone";
import { FiUpload, FiX } from "react-icons/fi";
import { HiOutlinePhotograph } from "react-icons/hi";
import { ALLOWED_IMAGE_TYPES, MAX_FILE_SIZE } from "../../constants";
import toast from "react-hot-toast";

export const CoverUpload = ({
  coverPreview,
  setCoverPreview,
  setCoverFile,
  disabled = false,
})=>{
  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;

    // Type validation
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      toast.error("Only JPG, PNG, WEBP images are allowed");
      return;
    }

    // Size validation
    if (file.size > MAX_FILE_SIZE.COVER_IMAGE) {
      toast.error("Avatar must be less than 2MB");
      return;
    }

    // Set the file for upload
    setCoverFile(file);

    // Generate preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setCoverPreview(reader.result);
    };
    reader.onerror = () => {
      toast.error("Failed to read image file");
    };
    reader.readAsDataURL(file);
  }, [setCoverFile, setCoverPreview]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    multiple: false,
    disabled,
    maxSize: MAX_FILE_SIZE.COVER_IMAGE,
  });

  const removeCover = (e) => {
    e.stopPropagation();
    setCoverFile(null);
    setCoverPreview(null);
  }
  return (
    <div
    {...getRootProps()}
    className={`relative h-48 md:h-64 cursor-pointer transition-all duration-300 overflow-hidden
      ${isDragActive ? "ring-4 ring-primary ring-offset-2 scale-[1.02]" : "hover:opacity-90"}
        ${disabled ? "opacity-50 cursor-not-allowed" : ""}
      `}
    >
      <input {...getInputProps()}/>

      {coverPreview ? (
        <>
        {/* Cover Image Preview */}
        <img
        src={coverPreview}
        alt="Cover preview"
        className="w-full h-full object-cover"
        />

        {/* Overlay with Actions */}
          {!disabled && (
            <div className="
              absolute inset-0 
              bg-black/40 
              opacity-0 hover:opacity-100 
              transition-opacity duration-300
              flex items-center justify-center gap-4
            ">
              <div className="flex flex-col items-center gap-2 text-white">
                <FiUpload className="h-10 w-10" />
                <span className="font-medium">
                  {isDragActive ? "Drop to replace" : "Click to change cover"}
                </span>
              </div>
              <button
                type="button"
                onClick={removeCover}
                className="
                  btn btn-circle btn-error btn-lg
                  shadow-lg hover:scale-110 transition-transform
                "
                aria-label="Remove cover"
              >
                <FiX className="h-6 w-6" />
              </button>
            </div>
          )}
        </>
      ):(
         <div className="w-full h-full bg-linear-to-r from-primary to-secondary flex flex-col items-center justify-center">
          <HiOutlinePhotograph className={`
            h-16 w-16 text-base-content/40 mb-4
            transition-transform duration-300
            ${isDragActive ? "scale-125 text-primary" : ""}
          `} />
          <p className="text-white font-semibold">
            {isDragActive
              ? "Drop cover image here"
              : "Click or drag cover image"}
          </p>
          <p className="text-white/70 text-sm mt-2">
            JPG, PNG, WEBP • Max 5MB
          </p>

          {isDragActive && (
            <div className="mt-4 px-4 py-2 bg-primary/20 rounded-lg">
              <p className="text-primary font-medium animate-pulse">
                Release to upload
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

CoverUpload.propTypes = {
  coverPreview: PropTypes.string,
  setCoverPreview: PropTypes.func.isRequired,
  setCoverFile: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};