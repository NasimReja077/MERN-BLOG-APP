import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ImBlog } from "react-icons/im";
import { MdOutlineAlternateEmail } from "react-icons/md";
import { GiPadlock } from "react-icons/gi";
import { GoEyeClosed, GoEye } from "react-icons/go";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { loginSchema } from '../utils/validation';

export const Login = () => {
  const { 
    register, 
    handleSubmit, 
    formState: { errors, isSubmitting }, 
  } = useForm({
    defaultValues: {
      email: "",
      password: ""
    },
    resolver: zodResolver(loginSchema),
    });

    const onSubmit = async(data) =>{
      try {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        console.log("Form Data:", data);

      } catch (error) {
        console.log(error);
        setError("root", {
          type: "manual",
          message: "Server Error",
        })
      }
    };
    console.log("error log:", errors);

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
                Welcome Back{" "}
              </h1>
              <p className="text-cyan-200">
                Get started with your free account
              </p>
            </div>
          </div>

           {/* FORM START */}
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          
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
                  {...register("email")}
                  className={`input input-lg input-primary input-bordered w-full pl-10 ${
                    errors.email ? "input-error" : "input-primary"
                  }`}
                  placeholder="you@example.com"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.username.message}
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
                  {...register("password")}
                  className={`input input-lg input-primary input-bordered w-full pl-10 ${errors.password ? "input-error" : "input-primary"}`}
                  placeholder="*******"
                />
                <div className='flex items-center mb-6'>
                  <Link to='/forgot-password' className='text-sm text-green-400 hover:underline'>
                  Forgot password?
                  </Link>
					</div>
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
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* SUBMIT BUTTON */}
            <button type="submit" disabled={isSubmitting} className="btn btn-primary btn-lg w-full mt-4">
              {isSubmitting ? (
                <>
                <Loader2 className="size-5 animate-spin" />
                Login...
                </>
              ) : (
                "Login"
              )}
            </button>
          </form>

          <div className="text-center">
            <p className="text-base-content/60">
               Don't have an account?{" "}
              <Link to="/login" className="link link-primary">
                Create account
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
          Welcome back!, Sign in to continue your conversations and catch up with your messages.
        </p>
      </div>
    </div>
  );
};
