import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ImBlog } from "react-icons/im";
import { FaUser, FaUsers } from "react-icons/fa6";
import { MdOutlineAlternateEmail } from "react-icons/md";
import { GiPadlock } from "react-icons/gi";
import { GoEyeClosed, GoEye } from "react-icons/go";
import { PiIdentificationBadgeLight } from "react-icons/pi";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { registerSchema } from '../utils/validation';
import { useDispatch, useSelector } from "react-redux";
import { register } from "../store/features/authSlice";
import toast from "react-hot-toast";
import { FiLoader } from "react-icons/fi";

export const Signup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.auth);
  const [showPassword, setShowPassword] = useState(false);
  const { 
    register: formRegister, 
    handleSubmit, 
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      username: "",
      email: "",
      password: "",
      aadhar: "",
    },
  });
  
  const onSubmit = async(data) =>{
      try {
        await dispatch(register(data)).unwrap();
        toast.success("Registration successful! Please verify your email.")
        navigate("/verify-otp");
      } catch (err) {
        toast.error(err?.message || "Registration failed" );
        // console.log("error log:", err);
      }
    };
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* left side */}

      <div className="flex flex-col justify-center items-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-8">

          {/* LOGO */}
          <div className="text-center mb-8">
            <div className="flex flex-col items-center gap-2 group">
              <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <ImBlog className="size-6 text-primary" />
              </div>
              <h1 className="text-4xl font-bold bg-linear-to-r from-orange-300 to-pink-600 bg-clip-text text-transparent">
                Create Account{" "}
              </h1>
              <p className="text-cyan-200">
                Get started with your free account
              </p>
            </div>
          </div>

           {/* FORM START */}
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            {/* Full Name */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Full Name</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none ">
                  <FaUser className="size-5 text-base-content/40 z-50 " />
                </div>
                <input
                  type="text"
                  {...formRegister("fullName")}
                  className={`input input-lg input-primary input-bordered w-full pl-10 ${
                    errors.fullName ? "input-error" : "input-primary"
                  }`}
                  placeholder="John Doe"
                />
                {errors.fullName && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.fullName.message}
                  </p>
                )}
              </div>
            </div>

            {/* Username */}

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">UserName</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none ">
                  <FaUsers className="size-5 text-base-content/40 z-50 " />
                </div>
                <input
                  type="text"
                  {...formRegister("username")}
                  className={`input input-lg input-primary input-bordered w-full pl-10 ${
                    errors.username ? "input-error" : "input-primary"
                  }`}
                  placeholder="john055"
                />
                {errors.username && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.username.message}
                  </p>
                )}
              </div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Email</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none ">
                  <MdOutlineAlternateEmail className="size-5 text-base-content/40 z-50 " />
                </div>
                <input
                  type="email"
                  {...formRegister("email")}
                  className={`input input-lg input-primary input-bordered w-full pl-10 ${
                    errors.email ? "input-error" : "input-primary"
                  }`}
                  placeholder="you@example.com"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>
            </div>
            
            {/* Password */}

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Password</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none ">
                  <GiPadlock className="size-5 text-base-content/40 z-50 " />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  {...formRegister("password")}
                  className={`input input-lg input-primary input-bordered w-full pl-10 ${errors.password ? "input-error" : "input-primary"}`}
                  placeholder="*******"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer "
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? (
                    <GoEyeClosed className="size-5 text-base-content/40" />
                  ) : (
                    <GoEye className="size-5 text-base-content/40" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Aadhar</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none ">
                  <PiIdentificationBadgeLight className="size-5 text-base-content/40 z-50 " />
                </div>
                <input
                  type="number"
                  {...formRegister("aadhar")}
                  className={`input input-lg input-primary input-bordered w-full pl-10 ${
                    errors.aadhar ? "input-error" : "input-primary"
                  }`}
                  placeholder="997314795003"
                />
              </div>
              {errors.aadhar && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.aadhar.message}
                </p>
              )}
            </div>
            {/* SUBMIT BUTTON */}
            <button type="submit" disabled={loading} className="btn btn-primary btn-lg w-full mt-4">
              {loading ? (
                <>
                <FiLoader className="size-5 animate-spin" />
                Creating Account...
                </>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          <div className="text-center">
            <p className="text-base-content/60">
              Already have an account?{" "}
              <Link to="/login" className="link link-primary">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
      {/* right side */}
      <div
        className="hidden lg:flex items-center justify-center bg-linear-to-br from-accent/10 via-base-100 to-base-200 p-12 sm:p-16 relative overflow-hidden"
        aria-hidden="true"
      >
        <h1 className="text-4xl font-bold mb-4">Join our community</h1>
        <p className="text-lg text-center max-w-md">
          Connect with friends, share moments, and stay in touch with your loved ones.
        </p>
      </div>
    </div>
  );
};
