// Frontend/src/components/UI/thumbnail/ThumbnailUploader.jsx
import React, { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { FiCamera, FiTrash2 } from "react-icons/fi";
import { FaImage } from "react-icons/fa";

export const ThumbnailUploader = ({ value, onChange, error, loading }) => {
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (!value) {
      setPreview(null);
      return;
    }
    const url = URL.createObjectURL(value);
    setPreview(null);
    return () => URL.revokeObjectURL(url);
  }, [value]);

  const onDrop = useCallback(
    (files) => {
      if (files[0]) onChange(files[0]);
    },
    [onChange]
  );
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    multiple: false,
  });
  return (
    <div>
      <label className="label font-semibold text-black">Thumbnail Image</label>
      <div
        className="h-64 sm:h-72 border-2 border-dashed rounded-xl p-8 shadow-xl flex flex-col items-center justify-center cursor-pointer hover:border-gray-400 border-gray-300 transition"
        {...getRootProps()}
      >
        <input
          // type="file" accept="image/*" hidden
          {...getInputProps()}
        />
        {!preview && (
          <div className="text-center text-gray-500">
            <FaImage size={30} />
            {/* <span className="mt-2 text-gray-500">Click to Upload Thumbnail</span> */}
            <p className="mt-2">
              {isDragActive ? "Drop Image Here" : "Click to Upload Thumbnail"}
            </p>
          </div>
        )}
        {preview && (
          <>
            <img
              src={preview}
              alt="cover"
              className="absolute inset-0 w-full h-full object-cover"
            />
            {!loading && (
              <div
                className={`absolute inset-0 backdrop:backdrop-blur-sm bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition`}
              >
                <FiCamera size={28} className="text-white" />
              </div>
            )}
          </>
        )}

        {/* Spinner */}
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <span className="loading loading-spinner loading-lg text-white"></span>
          </div>
        )}

        {preview && !loading && (
          <button
            type="button"
            onClick={() => onChange(null)}
            className="btn btn-sm btn-err"
          >
            <FiTrash2 size={10} />
          </button>
        )}

        {error && <p className="text-error text-sm font-medium">{error}</p>}

        <p className="text-xs text-gray-500 font-medium">
          JPG / PNG • Max 5MB • Recommended 1200×300
        </p>
      </div>
    </div>
  );
};
