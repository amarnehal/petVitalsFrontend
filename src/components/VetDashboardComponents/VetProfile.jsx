import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Button from "../Button";
import vetService from "../../services/vet";

const VetProfile = () => {
  const { userData, role, isAuthenticated } = useSelector(
    (state) => state.auth
  );

  const [vetMedicalInfo, setVetMedicalInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  // Fetch vet medical info on mount if user is vet
  useEffect(() => {
    if (isAuthenticated && role === "vet" && userData?.id) {
      console.log("seems to be true");

      const fetchMedicalInfo = async () => {
        try {
          console.log("userData ID=====", userData);

          const response = await vetService.getVet();
          console.log("Response---- is ---here", response);

          setVetMedicalInfo(response.data || null);
        } catch (err) {
          setError(err.message || "Failed to load medical info");
        } finally {
          setLoading(false);
        }
      };
      fetchMedicalInfo();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, role, userData]);

  if (!isAuthenticated) {
    return (
      <div className="h-screen flex justify-center items-center text-red-600">
        Please login to view your profile.
      </div>
    );
  }

  if (role !== "vet") {
    return (
      <div className="h-screen flex justify-center items-center text-red-600">
        Access denied: You are not a vet.
      </div>
    );
  }

  if (loading) {
    return (
      <div className="h-screen flex justify-center items-center text-gray-600">
        Loading profile...
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen flex justify-center items-center text-red-600">
        {error}
      </div>
    );
  }

  const vetInfo = {
    name: userData?.userName || "N/A",
    email: userData?.email || "N/A",
    phoneNumber: userData?.phoneNumber || "N/A",
  };

  const hasMedicalInfo = !!vetMedicalInfo;
  console.log("Medical info --- ", vetMedicalInfo);

  return (
    <div className="max-w-6xl mx-auto p-8 bg-gray-50 rounded-lg shadow-xl">
      <h2 className="text-3xl font-bold text-center text-teal-700 mb-10">
        Vet Profile
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Left Side: Vet Basic Info */}
        <div className="bg-white rounded-lg p-6 shadow-lg">
          <h3 className="text-xl font-semibold text-teal-600 mb-6">
            Basic Info
          </h3>
          <div className="space-y-5 text-gray-700 text-sm">
            <p>
              <span className="font-semibold text-teal-700">Name:</span>{" "}
              <span className="text-gray-900">{vetInfo.name}</span>
            </p>
            <p>
              <span className="font-semibold text-teal-700">Email:</span>{" "}
              <span className="text-gray-900">{vetInfo.email}</span>
            </p>
            <p>
              <span className="font-semibold text-teal-700">Phone Number:</span>{" "}
              <span className="text-gray-900">{vetInfo.phoneNumber}</span>
            </p>

            <div className="mt-8 flex justify-end">
              <Link to="/dashboard/update/vet-base-profile">
                <Button bgColor="bg-teal-600" textColor="text-white">
                  Update Basic Profile
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Right Side: Vet Medical Info */}
        <div className="bg-white rounded-lg p-6 shadow-lg">
          <h3 className="text-xl font-semibold text-teal-600 mb-6">
            Medical Profile
          </h3>

          {hasMedicalInfo ? (
            <div className="space-y-5 text-gray-700 text-sm">
              <p>
                <span className="font-semibold text-teal-700">
                  Clinical Address:
                </span>{" "}
                <span className="text-gray-900">
                  {vetMedicalInfo.clinicAddress || "N/A"}
                </span>
              </p>

              <p>
                <span className="font-semibold text-teal-700">
                  Qualifications:
                </span>{" "}
                <span className="text-gray-900">
                  {vetMedicalInfo.qualifications?.length > 0
                    ? vetMedicalInfo.qualifications.join(", ")
                    : "N/A"}
                </span>
              </p>

              <p>
                <span className="font-semibold text-teal-700">Experience:</span>{" "}
                <span className="text-gray-900">
                  {vetMedicalInfo.experienceYears
                    ? `${vetMedicalInfo.experienceYears} years`
                    : "N/A"}
                </span>
              </p>

              <p>
                <span className="font-semibold text-teal-700">Bio:</span>{" "}
                <span className="text-gray-900">
                  {vetMedicalInfo.bio || "No bio available."}
                </span>
              </p>

              <div className="pt-4">
                <p className="font-semibold text-teal-600 mb-3">
                  Available Dates & Slots:
                </p>

                <ul className="list-disc ml-6 space-y-2 text-gray-800">
                  {vetMedicalInfo.availability?.length > 0 ? (
                    vetMedicalInfo.availability.map(({ date, slots }, idx) => (
                      <li key={idx} className="leading-relaxed">
                        <span className="font-semibold text-indigo-700">
                          {new Date(date).toLocaleDateString()}:
                        </span>{" "}
                        <span className="text-indigo-900">
                          {slots.join(", ")}
                        </span>
                      </li>
                    ))
                  ) : (
                    <li className="text-gray-500">
                      No available dates and slots listed.
                    </li>
                  )}
                </ul>
              </div>

              <div className="mt-8 flex justify-end">
                <Link to="/dashboard/update/vet-info-profile">
                  <Button bgColor="bg-teal-600" textColor="text-white">
                    Update Medical Profile
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="flex justify-center">
              <Link to="/dashboard/vet-medicalInfo">
                <Button bgColor="bg-teal-600" textColor="text-white">
                  Add Medical Profile
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VetProfile;
