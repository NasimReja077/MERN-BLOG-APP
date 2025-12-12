import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ImBlog } from "react-icons/im";
import { FaUser, FaUsers } from "react-icons/fa6";
import { MdOutlineAlternateEmail } from "react-icons/md";
import { GiPadlock } from "react-icons/gi";
import { GoEyeClosed, GoEye } from "react-icons/go";
import { PiIdentificationBadgeLight } from "react-icons/pi";

export const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
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

          <form className="space-y-6">
            
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
                  className={`input input-lg input-primary input-bordered w-full pl-10`}
                  placeholder="John Doe"
                />
              </div>
            </div>

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
                  className={`input input-lg input-primary input-bordered w-full pl-10`}
                  placeholder="john055"
                />
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
                  className={`input input-lg input-primary input-bordered w-full pl-10`}
                  placeholder="you@example.com"
                />
              </div>
            </div>

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
                  className={`input input-lg input-primary input-bordered w-full pl-10`}
                  placeholder="*******"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer "
                  onClick={() => setShowPassword(prev => !prev)}
                >
                  {showPassword ? (
                    <GoEyeClosed className="size-5 text-base-content/40" />
                  ) : (
                    <GoEye className="size-5 text-base-content/40" />
                  )}
                </button>
              </div>
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
                  className={`input input-lg input-primary input-bordered w-full pl-10`}
                  placeholder="997314795003"
                />
              </div>
            </div>
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
        <h1 Join our community />
        <p>
          Connect with friends, share moments, and stay in touch with your loved
          ones.
        </p>
      </div>
    </div>
  );
};
