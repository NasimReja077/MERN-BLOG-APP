// Frontend/src/pages/VerifyOTP.jsx
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import PropTypes from 'prop-types';
import { otpSchema } from "../utils/validation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { verifyOTP } from "../store/features/authSlice";
import { FiLoader } from "react-icons/fi";
import { SiAuthelia } from "react-icons/si";
import { ROUTES, TOAST_MESSAGES, OTP_TIMEOUT } from '../components/constants';
import { formatTimeMMSS } from '../utils/formatters';

export const VerifyOTP = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, user, isAuthenticated } = useSelector((state) => state.auth);
  const [timeLeft, setTimeLeft] = useState(OTP_TIMEOUT); // seconds (default from constants)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setFocus,
    reset,
  } = useForm({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      code: ""
    },
  });

  // Auto-focus input on mount
  useEffect(() => {
    setFocus("code");
  }, [setFocus]);

  // Countdown timer
  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  // Redirect if already verified
  useEffect(() => {
    if (isAuthenticated && user?.isVerified) {
      navigate("/");
    }
  }, [isAuthenticated, user, navigate]);

  // Format time and expiry status
  const formattedTime = formatTimeMMSS(timeLeft);
  const isTimerExpired = timeLeft === 0;

  const onSubmit = async (data) => {
    try {
      await dispatch(verifyOTP(data.code)).unwrap();
      toast.success(TOAST_MESSAGES.EMAIL_VERIFIED);
      navigate(ROUTES.HOME);
    } catch (err) {
      toast.error(err?.message || TOAST_MESSAGES.VERIFICATION_FAILED);
      reset();
      setFocus("code");
    }
  };

  const handleResend = () => {
    // TODO: Replace with actual resend API call and handle errors properly
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 1500)),
      {
        loading: "Sending new OTP...",
        success: TOAST_MESSAGES.OTP_RESEND_SUCCESS,
        error: TOAST_MESSAGES.OTP_RESEND_FAILED,
      }
    );
    setTimeLeft(OTP_TIMEOUT);
    reset();
    setFocus("code");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 py-12 px-4">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-primary flex items-center justify-center gap-3">
            <SiAuthelia className="size-10" />
            Verify Your Email
          </h2>
          <p className="mt-3 text-base-content/70">
            Enter the 6-digit code sent to your email
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">OTP Code</span>
            </label>
            <input
              type="text"
              {...register("code", {
                onChange: (e) => {
                  // Only allow digits and max 6
                  e.target.value = e.target.value.replace(/\D/g, "").slice(0, 6);
                },
              })}
              maxLength={6}
              className={`input input-lg input-bordered w-full text-center text-4xl tracking-widest font-mono ${
                errors.code ? "input-error" : "input-primary"
              }`}
              placeholder="000000"
              autoComplete="off"
              inputMode="numeric"
              disabled={isSubmitting || loading || isTimerExpired}
            />
            {errors.code && (
              <p className="text-error text-sm mt-2">{errors.code.message}</p>
            )}
          </div>
          {/* Countdown Timer */}
          <div className="text-center">
            <div className="font-mono text-2xl text-primary">
                {formattedTime}
              </div>

            {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting || loading || isTimerExpired}
            className="btn btn-primary btn-lg w-full mt-6"
          >
            {(isSubmitting || loading) ? (
              <>
                <FiLoader className="size-5 animate-spin" />
                Verifying...
              </>
            ) : (
              "Verify OTP"
            )}
          </button>


            {/* <p className="text-sm text-base-content/60 mt-2">
              {isTimerExpired ? "Code expired" : "Time remaining"}
            </p> */}
          </div>

        </form>
        {/* Resend Link */}
        <div className="text-center text-sm">
          <p className="text-base-content/60">Didn't receive the code?</p>
          <button
            onClick={handleResend}
            disabled={!isTimerExpired}
            className={`link link-primary mt-2 ${!isTimerExpired ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {isTimerExpired ? "Resend OTP" : `Resend in ${timeLeft}s`}
          </button>
        </div>
      </div>
    </div>
  );
};

VerifyOTP.propTypes = {
  redirectTo: PropTypes.string,
};
