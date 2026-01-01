import React, { useState } from "react";
import PropTypes from 'prop-types';
import { Link } from "react-router-dom";
import { ROUTES, TOAST_MESSAGES } from '../components/constants';
import { ImBlog } from "react-icons/im";

import { MdAlternateEmail } from "react-icons/md";
import { truncateText } from '../utils/formatters';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { forgotPasswordSchema } from '../utils/validation';
import { useDispatch, useSelector } from "react-redux";
import { forgotPassword } from "../store/features/authSlice";
import toast from "react-hot-toast";
import { SiLodash } from "react-icons/si";
import { TiArrowLeftOutline } from "react-icons/ti";

export const ForgotPassword = ({ initialEmail = '' }) => {
  const dispatch = useDispatch();
  // const navigate = useNavigate();
  const { loading } = useSelector((state) => state.auth);

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: { email: initialEmail },
    resolver: zodResolver(forgotPasswordSchema),
  });
  
  const onSubmit = async (data) => {
    try {
      // ✅ FIXED: send object, not string
        await dispatch(forgotPassword({ email: data.email })).unwrap();
        setSubmittedEmail(data.email);
        setIsSubmitted(true);
        toast.success(TOAST_MESSAGES.PASSWORD_RESET_LINK_SENT);
      } catch (err) {
        toast.error(err?.message || TOAST_MESSAGES.PASSWORD_RESET_LINK_SENT_FAILED);
      }
    };
    
    return (
    
    <div className="min-h-screen flex items-center justify-center bg-base-200 py-12 px-4">
      <div className="w-full max-w-md space-y-8">
        
        {/* Header */}
        <div className="text-center">
          <div className="flex flex-col items-center gap-4">
            <div className="size-16 rounded-xl bg-primary/10 flex items-center justify-center">
              <ImBlog className="size-10 text-primary" />
            </div>
            <h2 className="text-4xl font-bold bg-linear-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
              Forgot Password
            </h2>
            <p className="text-base-content/70 max-w-sm">
              No worries! Enter your email and we'll send you a password reset link.
            </p>
          </div>
        </div>

        {/* Form or Success Message */}
        {!isSubmitted ? (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="form-control">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MdAlternateEmail className="size-5 text-base-content/40" />
              </div>
              <input
              type="email"
              {...register("email")}
              className={`input input-lg input-bordered w-full pl-10 
              ${errors.email ? "input-error" : "input-primary"}`}
              placeholder="you@example.com"
              disabled={loading || isSubmitting} 
              />
            </div>
            {errors.email && (
                <p className="text-error text-sm mt-2">{errors.email.message}</p>
              )}
          </div>
          
          <button
          type="submit"
          disabled={loading || isSubmitting}
          className="btn btn-primary btn-lg w-full"
          >
              {loading || isSubmitting ? (
                <>
                  <SiLodash className="size-5 animate-spin" />
                  Sending...
                </>
              ) : (
                "Send Reset Link"
              )}
            </button>
        </form>
        ):(
          <div className="text-center space-y-6 py-8">
            <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <div className="space-y-3">
              <p className="text-base-content/90">
                If an account exists for <span className="font-semibold">{truncateText(submittedEmail || "", 40)}</span>,
              </p>
              <p className="text-base-content/80">
                you will receive a password reset link shortly.
              </p>
              <p className="text-sm text-base-content/60">
                Check your spam folder if you don't see it.
              </p>
            </div>
          </div>
        )}
        {/* Back to Login */}
        <div className="text-center pt-4">
          <Link
            to={ROUTES.LOGIN}
            className="inline-flex items-center text-primary hover:underline font-medium"
          >
            <TiArrowLeftOutline className="size-4 mr-2" />
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

ForgotPassword.propTypes = {
  initialEmail: PropTypes.string,
};
