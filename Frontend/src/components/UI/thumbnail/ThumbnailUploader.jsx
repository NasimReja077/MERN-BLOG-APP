// Frontend/src/components/UI/thumbnail/ThumbnailUploader.jsx
import React, { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { FiCamera, FiTrash2 } from "react-icons/fi";
import { FaImage } from "react-icons/fa";

export const ThumbnailUploader = ({ value, onChange, error, loading = false }) => {
  const [preview, setPreview] = useState(null);

  // Generate preview when value (File) changes
  useEffect(() => {
    if (!value) {
      setPreview(null);
      return;
    }

    // value is a File object (from input/dropzone)
    const objectUrl = URL.createObjectURL(value);
    setPreview(objectUrl);

    // Cleanup: revoke object URL when component unmounts or value changes
    return () => URL.revokeObjectURL(objectUrl);
  }, [value]);

  const onDrop = useCallback(
    (acceptedFiles) => {
      if (acceptedFiles?.length > 0) {
        onChange(acceptedFiles[0]);
      }
    },
    [onChange]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    multiple: false,
    disabled: loading,
  });

  return (
    <div className="space-y-2">
      <label className="label font-semibold text-black">
        Thumbnail Image
      </label>

      <div
        {...getRootProps()}
        className={`
          relative h-64 sm:h-80 border-4 border-dashed rounded-2xl 
          flex flex-col items-center justify-center cursor-pointer
          transition-all duration-300 overflow-hidden
          ${isDragActive ? "border-primary bg-primary/5" : "border-base-300"}
          ${loading ? "cursor-not-allowed opacity-75" : "hover:border-primary"}
        `}
      >
        <input {...getInputProps()} />

        {/* No Image State */}
        {!preview && !loading && (
          <div className="text-center space-y-4">
            <FaImage className="w-16 h-16 text-gray-400" />
            <div>
              <p className="text-lg font-medium text-gray-600">
                {isDragActive ? "Drop your image here" : "Click or drag to upload thumbnail"}
              </p>
              <p className="text-sm text-gray-500 mt-2">
                JPG, PNG • Max 5MB • Recommended: 1200×630
              </p>
            </div>
          </div>
        )}

        {/* Preview Image */}
        {preview && (
          <div className="absolute inset-0">
            <img
              src={preview}
              alt="Thumbnail preview"
              className="w-full h-full object-cover"
            />

            {/* Hover Overlay */}
            {!loading && (
              <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-6">
                <div className="btn btn-circle btn-primary">
                  <FiCamera className="w-6 h-6" />
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent triggering dropzone
                    onChange(null);
                  }}
                  className="btn btn-circle btn-error"
                >
                  <FiTrash2 className="w-6 h-6" />
                </button>
              </div>
            )}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="loading loading-spinner loading-lg text-white"></span>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && <p className="text-error text-sm font-medium mt-2">{error}</p>}
    </div>
  );
};