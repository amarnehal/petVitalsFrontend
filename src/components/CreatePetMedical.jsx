import React, { useState } from "react";
import { useForm } from "react-hook-form";
import petService from "../services/pet";
import { createPetMedicalRecord } from "../store/petSlice";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import Input from "./Input";
import Button from "./Button";
import MedicalImageUploader from "./MedicalImageUploader";

const CreatePetMedical = () => {
  const { id: petId } = useParams();
  const [error, setError] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const {
    register,
    setValue,
    watch,
    formState: { errors },
    handleSubmit,
  } = useForm({
    defaultValues: {
      disease: "",
      allergies: "",
      vaccinationName: "",
      lastVaccinationDate: "",
      nextVaccinatonScheduleDate: "",
      notes: "",
      XRay: null,
      Reports: null,
      Prescription: null,
    }
  });

  // Watch file changes to trigger field validations correctly
  const filesWatch = watch(["XRay", "Reports", "Prescription"]);

  const handleFileChange = (fieldName, file) => {
    setValue(fieldName, file, { shouldValidate: true });
  };

  async function registerPetMedicalInfo(data) {
    setError(null);
    setIsUploading(true);
    setUploadProgress(1); // Start progress bar movement

    const formattedData = {
      ...data,
      allergies: data.allergies ? data.allergies.split(",").map((item) => item.trim()) : [],
      disease: data.disease ? data.disease.split(",").map((item) => item.trim()) : [],
    };

    const formData = new FormData();
    formattedData.disease.forEach((item) => formData.append("disease", item));
    formattedData.allergies.forEach((item) => formData.append("allergies", item));
    
    formData.append("vaccinationName", data.vaccinationName);
    formData.append("lastVaccinationDate", data.lastVaccinationDate);
    formData.append("nextVaccinatonScheduleDate", data.nextVaccinatonScheduleDate);
    formData.append("notes", data.notes);

    if (data.XRay) formData.append("XRay", data.XRay);
    if (data.Reports) formData.append("Reports", data.Reports);
    if (data.Prescription) formData.append("Prescription", data.Prescription);

    try {
      // Pass the progress hook directly into your petService instance
      const petData = await petService.createPetMedicalInfo(
        petId, 
        formData, 
        (progress) => setUploadProgress(progress)
      );
      
      if (petData) {
        dispatch(createPetMedicalRecord(petData));
        alert("Pet medical info has been created successfully!");
        navigate("/dashboard");
      }
    } catch (err) {
      setError(err.message || "An unexpected network error occurred");
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  }

  return (
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
          <p className="text-center text-red-600 font-medium bg-red-50 p-3 rounded-md">{error}</p>
        )}

        {/* Text Fields */}
        <Input
          label="Disease *"
          placeholder="Enter disease(s)..."
          disabled={isUploading}
          {...register("disease", { required: "Disease is required" })}
        />
        {errors.disease && (
          <p className="text-sm text-red-500 -mt-4">{errors.disease.message}</p>
        )}

        <Input
          label="Allergies"
          placeholder="Enter allergies or 'none'"
          disabled={isUploading}
          {...register("allergies")}
        />

        <Input 
          label="Vaccination Name *"
          type="text"
          placeholder="Vaccination name here"
          disabled={isUploading}
          {...register("vaccinationName", { required: "Vaccination name is required" })}
        />
        {errors.vaccinationName && (
          <p className="text-sm text-red-500 -mt-4">{errors.vaccinationName.message}</p>
        )}

        {/* Dates */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <Input
              label="Last Vaccination Date *"
              type="date"
              disabled={isUploading}
              {...register("lastVaccinationDate", { required: "Last Vaccination date is required" })}
            />
            {errors.lastVaccinationDate && (
              <p className="text-sm text-red-500 mt-1">{errors.lastVaccinationDate.message}</p>
            )}
          </div>

          <div>
            <Input
              label="Next Vaccination Date *"
              type="date"
              disabled={isUploading}
              min={new Date().toISOString().split("T")[0]}
              {...register("nextVaccinatonScheduleDate", {
                required: "Next Vaccination Date is required",
                validate: (value) => {
                  const selectedDate = new Date(value);
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);
                  return selectedDate >= today || "Next Vaccination Date cannot be in the past";
                },
              })}
            />
            {errors.nextVaccinatonScheduleDate && (
              <p className="text-sm text-red-500 mt-1">{errors.nextVaccinatonScheduleDate.message}</p>
            )}
          </div>
        </div>

        {/* Notes */}
        <div className="w-full max-w-md">
          <label className="block mb-1 text-sm font-medium text-gray-700">Notes</label>
          <textarea
            rows="3"
            placeholder="Any additional notes..."
            disabled={isUploading}
            {...register("notes")}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 text-sm disabled:opacity-50"
          />
        </div>

        {/* Cleaned Upload Sub-section */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4 border-t border-gray-100">
          <MedicalImageUploader
            label="X-Ray Image"
            name="XRay"
            onChange={handleFileChange}
            progress={uploadProgress}
            isUploading={isUploading}
          />

          <MedicalImageUploader
            label="Report"
            name="Reports"
            onChange={handleFileChange}
            progress={uploadProgress}
            isUploading={isUploading}
          />

          {/* Explicitly run required validation checks for custom component bindings */}
          <div>
            <MedicalImageUploader
              label="Prescription *"
              name="Prescription"
              onChange={handleFileChange}
              progress={uploadProgress}
              isUploading={isUploading}
              error={errors.Prescription?.message}
            />
            <input 
              type="hidden" 
              {...register("Prescription", { required: "Prescription image file is required" })} 
            />
          </div>
        </div>

        {/* Global Long-Running Spinner Element */}
        {isUploading && uploadProgress === 100 && (
          <div className="flex flex-col items-center justify-center p-4 bg-amber-50 rounded-lg text-amber-800 space-y-2 animate-pulse">
            <svg className="animate-spin h-6 w-6 text-amber-600" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <p className="text-sm font-semibold text-center">
              Files uploaded! Please do not refresh or close this tab while our engine optimizes and secures your health documents.
            </p>
          </div>
        )}

        {/* Submit Control Action Element */}
        <div className="pt-4 flex justify-center">
          <Button 
            type="submit" 
            bgColor={isUploading ? "bg-gray-400" : "bg-blue-600"} 
            textColor="text-white"
            disabled={isUploading}
          >
            {isUploading ? "Processing Application..." : "Create Pet Medical Info"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreatePetMedical;
