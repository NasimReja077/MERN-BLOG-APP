import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { FiUpload, FiX } from "react-icons/fi";
import { HiOutlinePhotograph } from "react-icons/hi";
import { ALLOWED_IMAGE_TYPES, MAX_FILE_SIZE } from '../../constants';
import toast from 'react-hot-toast';

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

    if (file.size > MAX_FILE_SIZE.COVER_IMAGE) {
      toast.error("Avatar must be less than 2MB");
      return;
    }
    setCoverFile(file);

    const render = new FileReader();
    render.onloadend = () => setCoverFile(render.result);
     render.readAsDataURL(file);
  },[setCoverFile]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    multiple: false,
    disabled,
  });

  const removeCover = (e) => {
    e.stopPropagation();
    setCoverFile(null);
    setCoverPreview(null);
  }
  return (
    <div
    {...getRootProps()}
    className={`relative h-48 md:h-64 cursor-pointer transition-all ${
        isDragActive ? "ring-4 ring-primary ring-offset-2" : ""
      }`}
    >
      <input {...getInputProps()}/>

      {coverPreview ? (
        <>
        <img
        src={coverPreview}
        alt='Cover'
        className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
          <FiUpload className="h-8 w-8 text-white" />
          <button
          type='button'
          onClick={removeCover}
          className='btn btn-circle btn-error'
          >
            <FiX className="h-6 w-6"/>
          </button>
        </div>
        </>
      ):(
         <div className="w-full h-full bg-linear-to-r from-primary to-secondary flex flex-col items-center justify-center">
          <HiOutlinePhotograph className="h-16 w-16 text-white/80 mb-4" />
          <p className="text-white font-semibold">
            {isDragActive
              ? "Drop cover image here"
              : "Click or drag cover image"}
          </p>
          <p className="text-white/70 text-sm mt-2">
            JPG, PNG, WEBP • Max 5MB
          </p>
        </div>
      )}
    </div>
  )
}