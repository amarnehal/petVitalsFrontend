import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login as storeLogin } from "../store/authSlice";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import authService from "../services/auth";
import Input from "../components/Input";
import Button from "./Button";


const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { register, handleSubmit, reset } = useForm();
  const [error, setErrors] = useState("");

  const auth = useSelector((state) => state.auth);

 const loginHandler = async (data) => {
  setErrors("");

  try {
    const session = await authService.loginUser(data);

    if (session?.data?.user && session?.data?.accessToken) {
      dispatch(storeLogin({
        userData: session.data.user,
        role: session.data.user.role,
        token: session.data.accessToken,    // ✅ Include token if available
      }));
      reset();
      setErrors("");
      navigate("/dashboard");
    } else {
      setErrors("Invalid login response.");
    }
  } catch (error) {
    console.error(error);
    setErrors(error.message || "Login failed. Please try again.");
  }
};


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
          Sign In
        </h2>

        {error && (
          <p className="text-red-600 text-sm mb-4 text-center">{error}</p>
        )}

        <form onSubmit={handleSubmit(loginHandler)} className="mt-8">
          <div className="space-y-5">
            <div>
              <Input
                label="Email: "
                placeholder="Enter your Email"
                type="email"
                {...register("email", {
                  required: true,
                  validate: {
                    matchPatern: (value) =>
                      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(
                        value
                      ) || "Email must be a valid address",
                  },
                })}
              />
            </div>
            <div>
              <Input
                label="Password: "
                placeholder="Enter your password here"
                type="password"
                {...register("password", {
                  required: true,
                })}
              />
            </div>
            <Button type="submit" className="w-full">
              Sign In
            </Button>
          </div>
        </form>
        <p className="mt-6 text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <Link
            to="/signUp"
            className="text-blue-500 hover:underline font-medium"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
