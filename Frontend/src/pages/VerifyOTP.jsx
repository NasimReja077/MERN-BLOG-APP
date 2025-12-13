import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { otpSchema } from "../utils/validation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { verifyOTP } from "../store/features/authSlice";
import { FiLoader } from "react-icons/fi";
import { SiAuthelia } from "react-icons/si";

export const VerifyOTP = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, user, isAuthenticated } = useSelector((state) => state.auth);
  const [timeLeft, setTimeLeft] = useState(180); // 3 min

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

  // Format time as MM:SS
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const isTimerExpired = timeLeft === 0;

  const onSubmit = async (data) => {
    try {
      await dispatch(verifyOTP(data.code)).unwrap();
      toast.success("Email verified successfully!");
      navigate("/");
    } catch (err) {
      toast.error(err?.message || "Invalid or expired OTP");
      reset();
      setFocus("code");
    }
  };

  const handleResend = () => {
    // TODO: Implement resend OTP API call here
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 1500)),
      {
        loading: "Sending new OTP...",
        success: "New OTP sent to your email!",
        error: "Failed to resend OTP",
      }
    );
    setTimeLeft(180);
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
              <span style={{ "--value": minutes }}></span>:
              <span style={{ "--value": seconds < 10 ? `0${seconds}` : seconds }}></span>
            </div>


            {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting || loading || isTimerExpired}
            className="btn btn-primary btn-lg w-full"
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
