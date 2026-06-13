import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "../../validations/registerSchema";
import { toast } from "react-toastify";

export default function Register({
  onSwitch,
  onClose,
}) {
  const [otpSent, setOtpSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues:{
      email:"abc@abc.com",
      mobile:"9876543210",
      password:"abcdefg",
      confirmPassword:"abcdefg"
    }
  });

  const onSubmit = async (data) => {
    try {
      console.log(data);

      // API Call Here
      // await registerUser(data);

      setOtpSent(true);

      toast.success("OTP Sent Successfully");
    } catch {
      toast.error("Registration Failed");
    }
  };

  const verifyOtp = () => {
    toast.success("Registration Completed");
  };

  return (
    <>
      <div className="mb-2 flex justify-end">
        <button
          type="button"
          onClick={onClose}
          className="text-2xl font-bold"
        >
          ×
        </button>
      </div>

      <h2 className="mb-6 text-center text-2xl font-bold">
        Register
      </h2>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4"
      >
        <div>
          <input
            {...register("email")}
            placeholder="Email"
            className="w-full rounded-lg border p-3"
          />
          <p className="text-sm text-red-500">
            {errors.email?.message}
          </p>
        </div>

        <div>
          <input
            {...register("mobile")}
            placeholder="Mobile Number"
            className="w-full rounded-lg border p-3"
          />
          <p className="text-sm text-red-500">
            {errors.mobile?.message}
          </p>
        </div>

        <div>
          <input
            type="password"
            {...register("password")}
            placeholder="Password"
            className="w-full rounded-lg border p-3"
          />
          <p className="text-sm text-red-500">
            {errors.password?.message}
          </p>
        </div>

        <div>
          <input
            type="password"
            {...register("confirmPassword")}
            placeholder="Confirm Password"
            className="w-full rounded-lg border p-3"
          />
          <p className="text-sm text-red-500">
            {errors.confirmPassword?.message}
          </p>
        </div>

        {!otpSent ? (
          <button
            disabled={isSubmitting}
            className="w-full rounded-lg bg-black p-3 text-white"
          >
            Register
          </button>
        ) : (
          <>
            <input
              placeholder="Enter OTP"
              className="w-full rounded-lg border p-3"
            />

            <button
              type="button"
              onClick={verifyOtp}
              className="w-full rounded-lg bg-green-600 p-3 text-white"
            >
              Verify OTP
            </button>
          </>
        )}
      </form>

      <p className="mt-6 text-center">
        Already have an account?{" "}
        <button
          onClick={onSwitch}
          className="font-semibold text-blue-600"
        >
          Login
        </button>
      </p>
    </>
  );
}