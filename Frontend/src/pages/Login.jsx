// Frontend/src/pages/Login.jsx
import React, { useState } from "react";
import PropTypes from 'prop-types';
import { Link, useNavigate } from "react-router-dom";
import { ROUTES, TOAST_MESSAGES } from '../components/constants';
import { ImBlog } from "react-icons/im";
import { MdOutlineAlternateEmail } from "react-icons/md";
import { GiPadlock } from "react-icons/gi";
import { GoEyeClosed, GoEye } from "react-icons/go";
import { FiLoader } from "react-icons/fi";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { loginSchema } from "../utils/validation";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../store/features/authSlice";
import toast from "react-hot-toast";

export const Login = ({ initialEmail = '', redirectTo = ROUTES.HOME }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.auth);

  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: initialEmail,
      password: "",
    },
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    try {
      await dispatch(login(data)).unwrap();
      toast.success(TOAST_MESSAGES.LOGIN_SUCCESS);
      navigate(redirectTo);
    } catch (err) {
      toast.error(err?.message || TOAST_MESSAGES.LOGIN_FAILED);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left Side - Login Form */}
      <div className="flex flex-col justify-center items-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-8">
          {/* Logo & Heading */}
          <div className="text-center mb-8">
            <div className="flex flex-col items-center gap-2 group">
              <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <ImBlog className="size-6 text-primary" />
              </div>
              <h1 className="text-4xl font-bold bg-linear-to-r from-orange-300 to-pink-600 bg-clip-text text-transparent">
                Welcome Back
              </h1>
              <p className="text-cyan-200">Sign in to continue to your account</p>
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Email Field */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Email</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MdOutlineAlternateEmail className="size-5 text-base-content/40" />
                </div>
                <input
                  type="email"
                  {...register("email")}
                  className={`input input-lg input-bordered w-full pl-10 ${
                    errors.email ? "input-error" : "input-primary"
                  }`}
                  placeholder="you@example.com"
                  disabled={loading}
                />
                {errors.email && (
                  <p className="text-error text-sm mt-2">{errors.email.message}</p>
                )}
              </div>
            </div>

            {/* Password Field */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Password</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <GiPadlock className="size-5 text-base-content/40" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  {...register("password")}
                  className={`input input-lg input-bordered w-full pl-10 pr-12 ${
                    errors.password ? "input-error" : "input-primary"
                  }`}
                  placeholder="*******"
                  disabled={loading}
                />
                {/* Eye Toggle */}
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? (
                    <GoEyeClosed className="size-5 text-base-content/40" />
                  ) : (
                    <GoEye className="size-5 text-base-content/40" />
                  )}
                </button>
              </div>

              {/* Forgot Password Link */}
              <div className="label">
                <Link
                  to={ROUTES.FORGOT_PASSWORD}
                  className="label-text-alt link link-primary hover:link-hover"
                >
                  Forgot password?
                </Link>
              </div>

              {errors.password && (
                <p className="text-error text-sm mt-2">{errors.password.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary btn-lg w-full"
            >
              {loading ? (
                <>
                  <FiLoader className="size-5 animate-spin" />
                  Logging in...
                </>
              ) : (
                "Login"
              )}
            </button>
          </form>

          {/* Sign Up Link */}
          <div className="text-center">
            <p className="text-base-content/60">
              Don't have an account?{" "}
              <Link to={ROUTES.SIGNUP} className="link link-primary font-medium">
                Create account
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Decorative */}
      <div
        className="hidden lg:flex flex-col items-center justify-center bg-linear-to-br from-accent/10 via-base-100 to-base-200 p-12 relative overflow-hidden"
        aria-hidden="true"
      >
        <h1 className="text-4xl font-bold mb-6 text-primary">Welcome back!</h1>
        <p className="text-lg text-center max-w-md text-base-content/80">
          Sign in to continue your conversations and catch up with your messages.
        </p>
      </div>
    </div>
  );
};

Login.propTypes = {
  initialEmail: PropTypes.string,
  redirectTo: PropTypes.string,
};