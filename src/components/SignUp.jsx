import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import authService from "../services/auth";
import { useDispatch } from "react-redux";
import { login } from "../store/authSlice";
import Input from "./Input";
import Button from "./Button";
import toast from "react-hot-toast";

const SignUp = () => {
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const registerUser = async (data) => {
    setError("");
    try {
      const registerPromise = authService.registerUser(data);

      toast.promise(registerPromise, {
        loading: "Creating account...",
        success: "Account created successfully!",
        error: "Failed to create account. Try again.",
      });

      const result = await registerPromise;

      // Auto-login after successful signup
      const session = await authService.getUserProfile();
      if (session?.data?.user) {
        dispatch(
          login({
            userData: session.data.user,
            role: session.data.user.role,
            token: session.data.accessToken,
          })
        );
        navigate("/dashboard");
      } else {
        setError("Failed to fetch user profile after signup.");
      }
    } catch (err) {
      setError(err.message || "Registration failed.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
          Sign Up
        </h2>

        {error && (
          <p className="text-red-600 text-sm mb-4 text-center">{error}</p>
        )}

        <form onSubmit={handleSubmit(registerUser)} className="space-y-5">
          <Input
            label="Username"
            placeholder="Enter your name"
            type="text"
            {...register("userName", { required: "Username is required" })}
          />
          {errors.userName && (
            <p className="text-red-600 text-xs">{errors.userName.message}</p>
          )}

          <Input
            label="Email"
            placeholder="Enter your email"
            type="email"
            {...register("email", {
              required: "Email is required",
              validate: {
                matchPattern: (value) =>
                  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ||
                  "Invalid email address",
              },
            })}
          />
          {errors.email && (
            <p className="text-red-600 text-xs">{errors.email.message}</p>
          )}

          <Input
            label="Phone Number"
            placeholder="e.g. 883-772-2211"
            type="tel"
            {...register("phoneNumber", {
              required: "Phone number is required",
              validate: {
                matchPattern: (value) =>
                  /^(\+?\d{1,4}[\s\-]?)?(\(?\d{1,3}\)?[\s\-]?)?(\d{1,4}[\s\-]?\d{1,4})$/.test(
                    value
                  ) || "Invalid phone number",
              },
            })}
          />
          {errors.phoneNumber && (
            <p className="text-red-600 text-xs">
              {errors.phoneNumber.message}
            </p>
          )}

          <Input
            label="Password"
            placeholder="Enter a secure password"
            type="password"
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
              },
            })}
          />
          {errors.password && (
            <p className="text-red-600 text-xs">{errors.password.message}</p>
          )}

          <Button type="submit" className="w-full">
            Create Account
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-blue-500 hover:underline font-medium"
          >
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
