import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import vetService from "../services/vet";
import { createUserAndPetInfo } from "../store/petSlice";
import Input from "./Input";
import Button from "./Button";
import toast from "react-hot-toast";

const RegisterPetAndUser = () => {
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();

  const registerUserAndPetByVet = async function (data) {
    setError("");
    try {
      const userData = await vetService.registerUserPet(data);
      if (userData) {
        dispatch(createUserAndPetInfo(userData));
        navigate("/");
      }
    } catch (error) {
      setError(error.message || "Failed to register Pet and User");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
          Create Pet And User
        </h2>

        {error && (
          <p className="text-red-600 text-sm mb-4 text-center">{error}</p>
        )}

        <form onSubmit={handleSubmit(registerUserAndPetByVet)} className="mt-8">
          <div className="space-y-5">
            {/* User Information */}
            <div>
              <Input
                label="UserName"
                placeholder="Enter Owner's name here"
                type="text"
                {...register("userName", {
                  required: "Owner Name is required",
                })}
              />
              {errors.userName && (
                <p className="text-red-600 text-xs">
                  {errors.userName.message}
                </p>
              )}
            </div>
            <div>
              <Input
                label="Email"
                placeholder="Enter your Email"
                type="email"
                {...register("email", {
                  required: false,
                  validate: {
                    matchPattern: (value) =>
                      !value ||
                      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(
                        value
                      ) ||
                      "Email must be a valid address",
                  },
                })}
              />
              {errors.email && (
                <p className="text-red-600 text-xs">{errors.email.message}</p>
              )}
            </div>
            <div>
              <Input
                label="Phone Number"
                placeholder="Enter owner's phone no. here eg: 883-772-2211"
                type="tel"
                {...register("phoneNumber", {
                  required: false,
                  validate: {
                    matchPattern: (value) =>
                      !value ||
                      /^(\+?\d{1,4}[\s\-]?)?(\(?\d{1,3}\)?[\s\-]?)?(\d{1,4}[\s\-]?\d{1,4}[\s\-]?\d{1,4})$/.test(
                        value
                      ) ||
                      "Phone number must be valid",
                  },
                })}
              />
              {errors.phoneNumber && (
                <p className="text-red-600 text-xs">
                  {errors.phoneNumber.message}
                </p>
              )}
            </div>

            {/* Pet Information */}
            <div>
              <Input
                label="Pet Name"
                placeholder="Pet Name here"
                type="text"
                {...register("petName", { required: "Pet Name is required" })}
              />
              {errors.petName && (
                <p className="text-red-600 text-xs">{errors.petName.message}</p>
              )}
            </div>
            <div>
              <Input
                label="Pet Age"
                placeholder="Enter pet age (0.1 for 1 month, max 17)"
                type="number"
                step="0.1"
                min="0.1"
                max="17"
                {...register("petAge", {
                  required: "Pet age is required",
                  min: {
                    value: 0.1,
                    message: "Pet must be at least 1 month old (0.1)",
                  },
                  max: { value: 17, message: "Pet age cannot exceed 17 years" },
                  valueAsNumber: true,
                })}
              />
              {errors.petAge && (
                <p className="text-red-600 text-xs">{errors.petAge.message}</p>
              )}
            </div>

            {/* Pet Gender */}
            <div>
              <label htmlFor="petGender" className="block text-gray-700">
                Pet Gender:
              </label>
              <select
                id="petGender"
                {...register("petGender", {
                  required: "Pet gender is required",
                })}
                className="w-full mt-2 p-2 border border-gray-300 rounded-md"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
              {errors.petGender && (
                <p className="text-red-600 text-xs">
                  {errors.petGender.message}
                </p>
              )}
            </div>

            {/* Pet Type */}
            <div>
              <label htmlFor="petType" className="block text-gray-700">
                Pet Type:
              </label>
              <select
                id="petType"
                {...register("petType", { required: "Pet type is required" })}
                className="w-full mt-2 p-2 border border-gray-300 rounded-md"
              >
                <option value="Dog">Dog</option>
                <option value="Cat">Cat</option>
              </select>
              {errors.petType && (
                <p className="text-red-600 text-xs">{errors.petType.message}</p>
              )}
            </div>
            <Button type="submit" className="w-full">
              Submit
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPetAndUser;
