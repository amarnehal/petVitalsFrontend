import React, { useState, useEffect} from "react";
import { useForm } from "react-hook-form";
import petService from "../services/pet";
import { createPetMedicalRecord } from "../store/petSlice";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import Input from "./Input";
import { useParams } from "react-router-dom";
import Button from "./Button";


const CreatePetMedical = () => {
 const { id: petId } = useParams()
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();

  async function registerPetMedicalInfo(data) {
    console.log("dataaaa",data);
    
    const formattedData = {
      ...data,
      allergies:data.allergies ? data.allergies.split(",").map((item)=>item.trim()) :[],
      disease:data.disease ? data.disease.split(",").map((item)=>item.trim()) :[],
    }
    const formData = new FormData()
   formattedData.disease.forEach((diseaseItem) => formData.append("disease", diseaseItem));
  formattedData.allergies.forEach((allergyItem) => formData.append("allergies", allergyItem));
    formData.append("vaccinationName",data.vaccinationName);
    formData.append("lastVaccinationDate", data.lastVaccinationDate);
    formData.append(
      "nextVaccinatonScheduleDate",
      data.nextVaccinatonScheduleDate
    );
    formData.append("notes", data.notes);

    console.log("form ---data",formData);
    

    if (data.XRay?.[0]) formData.append("XRay", data.XRay[0]);
    if (data.Reports?.[0]) formData.append("Reports", data.Reports[0]);
    if (data.Prescription?.[0])
      formData.append("Prescription", data.Prescription[0]);

    for (let [key, value] of formData.entries()) {
    console.log(`${key}:`, value);
  }

    try {
      const petData = await petService.createPetMedicalInfo(petId, formData);
      console.log("petdata rsponse here %%%%%%%%%%%%&&&&&",petData);
      
      if (petData) {
        dispatch(createPetMedicalRecord(petData));
        alert("Pet medical info has been created successfully")
        navigate("/dashboard");
      }
    } catch (error) {
      setError(error.message);
    }
  }
  return (
    <div>
    <div className="py-6 px-4 sm:px-8">
      <form
        onSubmit={handleSubmit(registerPetMedicalInfo)}
        encType="multipart/form-data"
        className="max-w-4xl mx-auto bg-white p-6 sm:p-8 rounded-lg shadow-md space-y-6"
      >
        <h2 className="text-2xl font-semibold text-center text-sky-700 mb-4">
          Create Pet Medical Information
        </h2>

        {error && (
          <p className="text-center text-red-600 font-medium">{error}</p>
        )}

        {/* Disease */}
        <Input
          label="Disease *"
          placeholder="Enter disease(s)..."
          {...register("disease", { required: "Disease is required" })}
        />
        {errors.disease && (
          <p className="text-sm text-red-500 -mt-4">{errors.disease.message}</p>
        )}

        {/* Allergies */}
        <Input
          label="Allergies"
          placeholder="Enter allergies or 'none'"
          {...register("allergies")}
        />
        <Input 
          label="vaccinationName"
          type="text"
          placeholder="Vaccination name here"
          {...register("vaccinationName",{
            required:"Vaccination name is required",
          })}
        />
        {errors.vaccinationName &&  <p className="text-sm text-red-500 -mt-4">
              {errors.vaccinationName.message}
            </p> }
        {/* Dates */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <Input
            label="Last Vaccination Date"
            type="date"
            {...register("lastVaccinationDate", {
              required: "Last Vaccination date is required",
            })}
          />
          {errors.lastVaccinationDate && (
            <p className="text-sm text-red-500 -mt-4">
              {errors.lastVaccinationDate.message}
            </p>
          )}

          <Input
            label="Next Vaccination Date"
            type="date"
            min={new Date().toISOString().split("T")[0]}
            {...register("nextVaccinatonScheduleDate", {
              required: "Next Vaccination Date is required",
              validate: (value) => {
                const selectedDate = new Date(value);
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                return (
                  selectedDate >= today ||
                  "Next Vaccination Date cannot be in the past"
                );
              },
            })}
          />
          {errors.nextVaccinatonScheduleDate && (
            <p className="text-sm text-red-500 -mt-4">
              {errors.nextVaccinatonScheduleDate.message}
            </p>
          )}
        </div>

        {/* Notes */}
        <div className="w-full max-w-md">
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Notes
          </label>
          <textarea
            rows="3"
            placeholder="Any additional notes..."
            {...register("notes")}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 text-sm"
          />
        </div>

        {/* File Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="w-full max-w-md">
            <label className="block mb-1 text-sm font-medium text-gray-700">
              X-Ray Image
            </label>
            <input
              type="file"
              accept="image/*"
              {...register("XRay")}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
            />
          </div>

          <div className="w-full max-w-md">
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Report
            </label>
            <input
              type="file"
              accept="image/*"
              {...register("Reports")}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
            />
          </div>

          <div className="w-full max-w-md">
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Prescription *
            </label>
            <input
              type="file"
              accept="image/*"
              {...register("Prescription", {
                required: "Prescription is required",
              })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
            />
            {errors.Prescription && (
              <p className="text-sm text-red-500 mt-1">
                {errors.Prescription.message}
              </p>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4 flex justify-center">
          <Button type="submit" bgColor="bg-blue-600" textColor="text-white">
            Create Pet Medical Info
          </Button>
        </div>
      </form>
    </div>
  );
    </div>
  );
};

export default CreatePetMedical;
