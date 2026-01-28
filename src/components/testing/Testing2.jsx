import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; // to access the dynamic URL params
import petService from  "../../services/pet"
import { useDispatch, useSelector } from 'react-redux';
import { getPetInfo } from '../../store/petSlice';
import { Link } from 'react-router-dom';
import Button from '../Button'; // Assuming you have a Button component

import { PhotoProvider, PhotoView } from "react-photo-view";
import "react-photo-view/dist/react-photo-view.css";

const dummyData = {
  "statusCode": 200,
  "message": "Pet details fetched successfully",
  "data": {
    "pet": {
      "_id": "61a63f45b7b3b56c44b9d7bb",
      "name": "Max",
      "age": 6,
      "gender": "Male",
      "petType": "Cat",
      "createdAt": "2025-06-25T07:30:00.000Z",
      "updatedAt": "2025-07-04T05:57:56.744Z",
      "__v": 0
    },
    "medicalInfo": {
      "disease": ["Feline Leukemia"],
      "allergies": ["Pollen", "Dust"],
      "xRay": [
        {
          "url": "https://cloudinary.com/xray.jpg",
          "mimetype": "image/jpeg",
          "size": 500000,
          "cloudinaryImageId": "123456789"
        }
      ],
      "reports": [
        {
          "url": "https://cloudinary.com/report.jpg",
          "mimetype": "application/pdf",
          "size": 1000000,
          "cloudinaryImageId": "987654321"
        }
      ],
      "vaccinationName": "Rabies",
      "lastVaccinationDate": "2025-03-15",
      "nextVaccinatonScheduleDate": "2025-09-15",
      "notes": ["No additional notes."],
      "prescription": [
        {
          "url": "https://cloudinary.com/prescription.jpg",
          "mimetype": "application/pdf",
          "size": 150000,
          "cloudinaryImageId": "1122334455"
        }
      ]
    }
  }
}
const PetMedicalDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const petInfo = useSelector((state) => state.pet.petBasicInfo); // Access full pet info

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchPetDetails() {
      setLoading(true);
      try {
        dispatch(getPetInfo({ data: dummyData })); // Dispatching the data properly
        setLoading(false);
      } catch (error) {
        setError("Failed to fetch pet details");
        setLoading(false);
      }
    }
    fetchPetDetails();
  }, [dispatch, id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl text-gray-500">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl text-red-600">Error: {error}</div>
      </div>
    );
  }

  if (!petInfo || !petInfo.data) {
    return (
      <div className="text-center text-red-600">Pet information not found.</div>
    );
  }

  const petData = petInfo?.data;
  const pet = petData?.pet;
  const medicalInfo = petData?.medicalInfo;

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-xl p-6 sm:p-10">
        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-sky-700">
            {pet?.name}'s Medical Profile
          </h1>
          <p className="text-gray-500 mt-1">Health summary and records</p>
          <p className="text-gray-600">Age: {pet?.age}</p>
            <p className="text-gray-600">Type: {pet?.petType}</p>
        </div>

        {/* Medical Info */}
        {medicalInfo ? (
          <div className="bg-sky-50 p-6 rounded-lg shadow mb-8">
            <h2 className="text-xl font-semibold text-sky-800 mb-4">Medical Information</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-800">
              <div><strong>Disease:</strong> {medicalInfo?.disease.join(", ")}</div>
              <div><strong>Allergies:</strong> {medicalInfo?.allergies.join(", ")}</div>
              <div><strong>Vaccination:</strong> {medicalInfo?.vaccinationName}</div>
              <div><strong>Last Vaccinated:</strong> {new Date(medicalInfo?.lastVaccinationDate).toLocaleDateString()}</div>
              <div><strong>Next Vaccination:</strong> {new Date(medicalInfo?.nextVaccinatonScheduleDate).toLocaleDateString()}</div>
              <div><strong>Notes:</strong> {medicalInfo?.notes.join(", ")}</div>
            </div>
          </div>
        ) : (
          <div className="text-center text-gray-600 mb-8">
            No medical records found for {pet?.name}.
          </div>
        )}

        {/* Images & File Sections */}
        <PhotoProvider>
          <div className="space-y-8">
            {/* Prescriptions */}
            {medicalInfo?.prescription?.length > 0 && (
              <div className="bg-blue-50 p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold text-blue-800 mb-4">Prescriptions</h3>
                <div className="flex flex-wrap gap-4">
                  {medicalInfo.prescription.map((item, idx) => (
                    <PhotoView key={idx} src={item.url}>
                      <img
                        src={item.url}
                        alt={`Prescription ${idx + 1}`}
                        className="w-32 h-32 object-cover rounded cursor-pointer shadow"
                      />
                    </PhotoView>
                  ))}
                </div>
              </div>
            )}

            {/* X-Ray Images */}
            {medicalInfo?.xRay?.length > 0 && (
              <div className="bg-purple-50 p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold text-purple-800 mb-4">X-Ray Images</h3>
                <div className="flex flex-wrap gap-4">
                  {medicalInfo.xRay.map((item, idx) => (
                    <PhotoView key={idx} src={item.url}>
                      <img
                        src={item.url}
                        alt={`X-Ray ${idx + 1}`}
                        className="w-32 h-32 object-cover rounded cursor-pointer shadow"
                      />
                    </PhotoView>
                  ))}
                </div>
              </div>
            )}

            {/* Reports */}
            {medicalInfo?.reports?.length > 0 && (
              <div className="bg-green-50 p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold text-green-800 mb-4">Reports</h3>
                <div className="flex flex-wrap gap-4">
                  {medicalInfo.reports.map((item, idx) => (
                    <PhotoView key={idx} src={item.url}>
                      <img
                        src={item.url}
                        alt={`Report ${idx + 1}`}
                        className="w-32 h-32 object-cover rounded cursor-pointer shadow"
                      />
                    </PhotoView>
                  ))}
                </div>
              </div>
            )}
          </div>
        </PhotoProvider>

        {/* Action Button */}
        <div className="flex justify-center mt-10">
          {medicalInfo ? (
            <Link to={`/dashboard/update-pet-medical/${pet?._id}`}>
              <Button bgColor="bg-sky-600" textColor="text-white">Update Medical Info</Button>
            </Link>
          ) : (
            <Link to={`/dashboard/create-pet-medical/${pet?._id}`}>
              <Button bgColor="bg-green-600" textColor="text-white">Create Medical Info</Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};


export default PetMedicalDetails;




