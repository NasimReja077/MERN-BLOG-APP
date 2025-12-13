
import { Link } from "react-router-dom";
import { ImBlog } from "react-icons/im";
import { MdOutlineAlternateEmail } from "react-icons/md";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { registerSchema } from '../utils/validation';

export const ForgotPassword = () => {
  const { 
    register, 
    handleSubmit, 
    formState: { errors, isLoading }, 
  } = useForm({
    defaultValues: {
      email: "",
    },
    resolver: zodResolver(registerSchema),
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
  return (
    <div className='p-8'>
      {/* left side */}

      <div className="flex flex-col justify-center items-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-8">

          {/* LOGO */}
          <div className="text-center mb-8">
            <div className="flex flex-col items-center gap-2 group">
              <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <ImBlog className="size-6 text-primary" />
              </div>
              <h2 className='text-3xl font-bold mb-6 text-center bg-linear-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text'>
                Forgot Password</h2>
  
            </div>
          </div>

           {/* FORM START */}
          { !isSubmitted ? (
            <form className="space-y-6" onSubmit={handleSubmit}>
          
            <div className="form-control">
              <p className='text-gray-300 mb-6 text-center'>
							Enter your email address and we'll send you a link to reset your password.
						</p>
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
                  placeholder='Email Address'
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.username.message}
                  </p>
                )}
              </div>
            </div>
  
            {/* SUBMIT BUTTON */}
            <button type="submit" className="btn btn-primary btn-lg w-full mt-4">
              {isLoading ? <Loader className='size-6 animate-spin mx-auto'/> : "Send Reset Link"}
            </button>
          </form>
          ): (
            <div className='text-center w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4'>
						{/* <motion.div
							initial={{ scale: 0 }}
							animate={{ scale: 1 }}
							transition={{ type: "spring", stiffness: 500, damping: 30 }}
							
						>
							<Mail className='h-8 w-8 text-white' />
						</motion.div> */}
						<p className='text-gray-300 mb-6'>
							If an account exists for {email}, you will receive a password reset link shortly.
						</p>
					</div>
          )}

        </div>

        <div className='px-8 py-4 bg-gray-900 bg-opacity-50 flex justify-center'>
				<Link to={"/login"} className='text-sm text-green-400 hover:underline flex items-center'>
					<ArrowLeft className='h-4 w-4 mr-2' /> Back to Login
				</Link>
			</div>

      </div>
    </div>
  );
};
