import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import petService from "../services/pet";
import { getPetInfo, removePet } from "../store/petSlice";
import Button from "./Button";
import { PhotoProvider, PhotoView } from "react-photo-view";
import "react-photo-view/dist/react-photo-view.css";

const PetMedicalDetails = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [removing, setRemoving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const petInfo = useSelector((state) => state.pet.petInfo);
  const pet = petInfo?.pet ?? null;
  const medicalInfo = petInfo?.medicalInfo ?? null;
  console.log("Pet ------ Info ---",petInfo);
  

  useEffect(() => {
    const fetchPetDetails = async () => {
      try {
        setLoading(true);
        const response = await petService.getPetInfo(id);
        console.log("response", response);

        dispatch(getPetInfo(response.data));
      } catch (err) {
        console.error("Error fetching pet details:", err);
        setError(err.message || "Failed to fetch pet details.");
      } finally {
        setLoading(false);
      }
    };

    fetchPetDetails();
  }, [dispatch, id]);

 const handleRemovePet = async () => {
  const confirmed = window.confirm(
    "Are you sure you want to remove this pet? This action cannot be undone."
  );

  if (!confirmed) return;

  try {
    setRemoving(true);
    setMessage({ type: "", text: "" });

    await petService.removePet(id); // call your service
    dispatch(removePet(id)); // update redux store

    setMessage({
      type: "success",
      text: "Pet profile removed successfully. Redirecting to dashboard...",
    });

    // Redirect after 2 seconds
    setTimeout(() => {
      navigate("/dashboard");
    }, 2000);
  } catch (err) {
    setMessage({
      type: "error",
      text:
        err?.response?.data?.message || err.message || "Failed to remove pet",
    });
  } finally {
    setRemoving(false);
  }
};


  const renderImages = useCallback(
    (title, items, color) => (
      <div className={`bg-${color}-50 p-6 rounded-lg shadow`}>
        <h3 className={`text-lg font-semibold text-${color}-800 mb-4`}>
          {title}
        </h3>
        {items?.length ? (
          <div className="flex flex-wrap gap-4">
            {items.map((item, idx) => (
              <PhotoView key={idx} src={item.url}>
                <img
                  src={item.url}
                  alt={`${title} ${idx + 1}`}
                  className="w-32 h-32 object-cover rounded shadow cursor-pointer"
                />
              </PhotoView>
            ))}
          </div>
        ) : (
          <p className="text-gray-600 text-center">
            No {title.toLowerCase()} available.
          </p>
        )}
      </div>
    ),
    []
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-xl text-gray-500">
        Fetching pet details...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-xl text-red-600">
        {error}
      </div>
    );
  }

  if (!pet) {
    return (
      <div className="flex justify-center items-center h-screen text-xl text-gray-600">
        No Pet Information Found.
      </div>
    );
  }

  return (
    <>
      {message.text && (
      <div
        className={`text-center mb-4 p-4 rounded-lg font-semibold ${
          message.type === "success"
            ? "bg-green-100 text-green-700"
            : "bg-red-100 text-red-700"
        }`}
      >
        {message.text}
      </div>
    )}
  
    <div className="container mx-auto px-4 py-10 min-h-screen">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-8">
        <header className="text-center mb-10">
          <h1 className="mb-2 text-3xl font-bold text-sky-700">
            {pet.name}'s Medical Profile
          </h1>
          <p className="text=2xl font-italic text-sky-700">
            Age: {pet.age} year{" "}
          </p>
          <p className="text=2xl font-italic text-sky-700">
            Gender: {pet.gender}{" "}
          </p>
          <p className="text=2xl font-italic text-sky-700">
            Pet-Type: {pet.petType}{" "}
          </p>
          <p className="text-gray-500 mt-2">Health summary and records</p>
        </header>

        {medicalInfo ? (
          <section className="bg-sky-50 p-6 rounded-lg shadow mb-10">
            <h2 className="text-xl font-semibold text-sky-800 mb-4">
              Medical Information
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-800">
              <div className="flex flex-wrap gap-2">
                <strong>Disease:</strong>
                {medicalInfo.disease?.length ? (
                  medicalInfo.disease.map((item, idx) => (
                    <span
                      key={idx}
                      className="bg-sky-200 text-sky-800 px-2 py-1 rounded text-sm"
                    >
                      {item}
                    </span>
                  ))
                ) : (
                  <span className="text-gray-500 ml-2">None</span>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                <strong>Allergies:</strong>
                {medicalInfo.allergies?.length ? (
                  medicalInfo.allergies.map((item, idx) => (
                    <span
                      key={idx}
                      className="bg-red-200 text-sky-800 px-2 py-1 rounded text-sm"
                    >
                      {item}
                    </span>
                  ))
                ) : (
                  <span className="text-gray-500 ml-2">None</span>
                )}
              </div>
              <div>
                <strong>Vaccination:</strong>{" "}
                {medicalInfo.vaccinationName || "N/A"}
              </div>
              <div>
                <strong>Last Vaccinated:</strong>{" "}
                {medicalInfo.lastVaccinationDate
                  ? new Date(
                      medicalInfo.lastVaccinationDate
                    ).toLocaleDateString()
                  : "N/A"}
              </div>
              <div>
                <strong>Next Vaccination:</strong>{" "}
                {medicalInfo.nextVaccinatonScheduleDate
                  ? new Date(
                      medicalInfo.nextVaccinatonScheduleDate
                    ).toLocaleDateString()
                  : "N/A"}
              </div>
              <div>
                <strong>Notes:</strong>{" "}
                {medicalInfo.notes?.join(", ") || "None"}
              </div>
            </div>
          </section>
        ) : (
          <div className="text-center text-gray-600 mb-10">
            No medical records found for {pet.name}.
          </div>
        )}

        <PhotoProvider>
          <div className="space-y-8">
            {renderImages("Prescriptions", medicalInfo?.prescription, "blue")}
            {renderImages("X-Ray Images", medicalInfo?.xRay, "purple")}
            {renderImages("Reports", medicalInfo?.reports, "green")}
          </div>
        </PhotoProvider>

        <div className="flex flex-col sm:flex-row justify-center items-center mt-10 gap-4">
          <Link
            to={
              medicalInfo
                ? `/dashboard/update-pet-medical/${pet._id}`
                : `/dashboard/create-pet-medical/${pet._id}`
            }
          >
            <Button
              bgColor={medicalInfo ? "bg-sky-600" : "bg-green-600"}
              textColor="text-white"
            >
              {medicalInfo ? "Update Medical Info" : "Create Medical Info"}
            </Button>
          </Link>

          <Button
            bgColor="bg-red-600"
            textColor="text-white"
            onClick={handleRemovePet}
            disabled={removing}
          >
            {removing ? "Removing..." : "Remove Pet"}
          </Button>
        </div>
      </div>
    </div>
      </>
  );
};

export default PetMedicalDetails;
