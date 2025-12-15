import React, { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { GiLoad, GiPadlock } from "react-icons/gi";
import { GoEye, GoEyeClosed } from "react-icons/go";
// import { Loader2 } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { resetPasswordSchema } from "../utils/validation";
import { useDispatch, useSelector } from "react-redux";
import { resetPassword } from "../store/features/authSlice";
import toast from "react-hot-toast";

export const ResetPassword = () => {
  const { token } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.auth);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data) => {
    if (!token) {
      toast.error("Invalid reset link");
      return;
    }

    try {
      await dispatch(resetPassword({ token, newPassword: data.newPassword })).unwrap();
      toast.success("Password reset successfully!");
      navigate("/login");
    } catch (err) {
      toast.error(err?.message || "Failed to reset password. Link may be expired.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 py-12 px-4">
      <div className="w-full max-w-md">
        <div className="bg-base-100 rounded-2xl shadow-xl overflow-hidden p-8">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold bg-linear-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
              Reset Password
            </h2>
            <p className="mt-3 text-base-content/70">Enter your new password below</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* New Password */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">New Password</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <GiPadlock className="size-5 text-base-content/40" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  {...register("newPassword")}
                  className={`input input-lg input-bordered w-full pl-10 pr-12 ${
                    errors.newPassword ? "input-error" : "input-primary"
                  }`}
                  placeholder="••••••••"
                  disabled={loading}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? <GoEyeClosed className="size-5" /> : <GoEye className="size-5" />}
                </button>
              </div>
              {errors.newPassword && (
                <p className="text-error text-sm mt-2">{errors.newPassword.message}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Confirm Password</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <GiPadlock className="size-5 text-base-content/40" />
                </div>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  {...register("confirmPassword")}
                  className={`input input-lg input-bordered w-full pl-10 pr-12 ${
                    errors.confirmPassword ? "input-error" : "input-primary"
                  }`}
                  placeholder="••••••••"
                  disabled={loading}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                >
                  {showConfirmPassword ? <GoEyeClosed className="size-5" /> : <GoEye className="size-5" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-error text-sm mt-2">{errors.confirmPassword.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary btn-lg w-full"
            >
              {loading ? (
                <>
                  <GiLoad className="size-5 animate-spin" />
                  Resetting...
                </>
              ) : (
                "Set New Password"
              )}
            </button>
          </form>

          <div className="text-center mt-6">
            <Link to="/login" className="link link-primary hover:link-hover">
              ← Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};