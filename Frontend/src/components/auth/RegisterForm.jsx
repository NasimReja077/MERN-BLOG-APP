import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema } from '../../utils/validation';
// import { Eye, EyeOff, Upload } from 'lucide-react';
import { IoEyeOffOutline, IoEyeOutline } from 'react-icons/io5';
import { GrFormUpload } from "react-icons/gr";
export const RegisterForm = ({ onSubmit, loading }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const { register, handleSubmit, formState: { errors }, setValue } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setValue('avatar', file);
      const reader = new FileReader();
      reader.onloadend = () => setAvatarPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="flex justify-center mb-4">
        <div className="relative">
          {avatarPreview ? (
            <img src={avatarPreview} alt="Avatar preview" className="w-24 h-24 rounded-full object-cover" />
          ) : (
            <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center">
              <GrFormUpload size={32} className="text-gray-400" />
            </div>
          )}
          <input type="file" accept="image/*" onChange={handleAvatarChange} className="absolute inset-0 opacity-0 cursor-pointer" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Username*</label>
          <input type="text" {...register('username')} className="input-field" />
          {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email*</label>
          <input type="email" {...register('email')} className="input-field" />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Password*</label>
        <div className="relative">
          <input type={showPassword ? 'text' : 'password'} {...register('password')} className="input-field pr-10" />
          <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
            {showPassword ? <IoEyeOffOutline size={20} /> : <IoEyeOutline size={20} />}
          </button>
        </div>
        {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
        <input type="text" {...register('fullName')} className="input-field" />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
        <textarea {...register('bio')} rows={3} className="input-field resize-none" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Mobile</label>
          <input type="text" {...register('mobile')} className="input-field" placeholder="10 digits" />
          {errors.mobile && <p className="text-red-500 text-sm mt-1">{errors.mobile.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Aadhar</label>
          <input type="text" {...register('aadhar')} className="input-field" placeholder="12 digits" />
          {errors.aadhar && <p className="text-red-500 text-sm mt-1">{errors.aadhar.message}</p>}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
        <input type="text" {...register('address')} className="input-field" />
      </div>

      <button type="submit" disabled={loading} className="btn-primary w-full">
        {loading ? 'Registering...' : 'Register'}
      </button>
    </form>
  );
};