import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import Input from '../Input';
import Button from '../Button';
import vetService from '../../services/vet';
import { useDispatch, useSelector } from 'react-redux';
import { updateVetBasicInfo, getVetBasicInfo as getVetBasicInfoAction } from '../../store/vetSlice';

const UpdateVet = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const vetInfo = useSelector((state) => state.vet.vetBasicInfo);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  // Fetch vet data on load
useEffect(() => {
  if (!vetInfo) {
    // Fetch from server only if not present
    vetService.getVet().then((res) => {
      dispatch(getVetBasicInfoAction(res));
      // Set form values...
    }).catch(err => {
      setError("Failed to fetch vet info");
    });
  } else {
    // Set form with existing data
    setValue("name", vetInfo.name);
    setValue("email", vetInfo.email);
    setValue("phoneNumber", vetInfo.phoneNumber);
    setValue("password", "");
  }
}, [vetInfo, dispatch, setValue]);

  const handleVetUpdateBasicProfile = async (data) => {
    setLoading(true);
    try {
      const res = await vetService.updateVetProfile(data);
      if (res?.data) {
        dispatch(updateVetBasicInfo(res));
        navigate("/dashboard"); // Navigate after success
      }
    } catch (err) {
      setError(err.message || "Failed to update vet profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
          Update Vet Basic Info
        </h2>

        {error && <p className="text-red-600 text-sm mb-4 text-center">{error}</p>}

        <form onSubmit={handleSubmit(handleVetUpdateBasicProfile)} className="space-y-5">
          <Input
            label="Name"
            placeholder="Enter your name"
            {...register("name", { required: "Name is required" })}
            error={errors.name}
          />

          <Input
            label="Email"
            type="email"
            placeholder="Enter your email"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^\S+@\S+$/i,
                message: "Enter a valid email",
              },
            })}
            error={errors.email}
          />

          <Input
            label="Phone Number"
            placeholder="Enter phone number"
            {...register("phoneNumber", {
              required: "Phone number is required",
              pattern: {
                value: /^\+?[0-9\s\-]{7,15}$/,
                message: "Invalid phone number",
              },
            })}
            error={errors.phoneNumber}
          />

          <Input
            label="Password"
            type="password"
            placeholder="Update password"
            {...register("password", {
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
              },
            })}
            error={errors.password}
          />

          <Button type="submit" disabled={loading}>
            {loading ? "Updating..." : "Update Profile"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default UpdateVet;
