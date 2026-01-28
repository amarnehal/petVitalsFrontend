import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import petService from "../services/pet";
import Input from "./Input";
import Button from "./Button";
import { updatePetMedicalInfo as updatePetMedicalInfoAction } from "../store/petSlice";

const UpdatePetMedical = () => {
  const { id } = useParams();  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { register, handleSubmit, setValue, formState: { errors } } = useForm();

  

 useEffect(() => {
  const fetchMedicalData = async () => {
    setLoading(true);
    try {
      const response = await petService.getPetInfo(id);
      console.log("response474747",response);
      
      const record = response?.data?.medicalInfo;
      console.log("record",record);
      

      if (record) {
        setValue("disease", record.disease || "");
        setValue("allergies", record.allergies || "");
        setValue("vaccinationName",record.vaccinationName || "");
        setValue("lastVaccinationDate", record.lastVaccinationDate?.substring(0, 10) || "");
        setValue("nextVaccinatonScheduleDate", record.nextVaccinatonScheduleDate?.substring(0, 10) || "");
        setValue("notes", record.notes || "");
      }
    } catch (err) {
      setError("Failed to load medical record.");
    } finally {
      setLoading(false);
    }
  };

  fetchMedicalData();
}, [id, setValue]);


  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append("disease", data.disease);
    formData.append("allergies", data.allergies);
    formData.append("vaccinationName",data.vaccinationName);
    formData.append("lastVaccinationDate", data.lastVaccinationDate);
    formData.append("nextVaccinatonScheduleDate", data.nextVaccinatonScheduleDate);
    formData.append("notes", data.notes);

    if (data.XRay?.[0]) formData.append("XRay", data.XRay[0]);
    if (data.Reports?.[0]) formData.append("Reports", data.Reports[0]);
    if (data.Prescription?.[0]) formData.append("Prescription", data.Prescription[0]);

    try {
      const petData = await petService.updatePetMedicalInfo(id, formData);
      if (petData) {
        dispatch(updatePetMedicalInfoAction(petData.data));
        navigate("/dashboard");
      }
    } catch (err) {
      setError(err.message || "Failed to update record.");
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen text-lg text-gray-500">Loading...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen text-lg text-red-600">Error: {error}</div>;
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      encType="multipart/form-data"
      className="max-w-4xl mx-auto bg-white p-6 sm:p-8 rounded-lg shadow-md space-y-6"
    >
      <h2 className="text-2xl font-semibold text-center text-sky-700 mb-4">Update Pet Medical Information</h2>

      <Input label="Disease *" placeholder="Enter disease(s)..." {...register("disease", { required: "Disease is required" })} />
      {errors.disease && <p className="text-sm text-red-500 -mt-4">{errors.disease.message}</p>}

      <Input label="Allergies" placeholder="Enter allergies or 'none'" {...register("allergies")} />
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
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <Input
          label="Last Vaccination Date"
          type="date"
          {...register("lastVaccinationDate", { required: "Last Vaccination date is required" })}
        />
        {errors.lastVaccinationDate && <p className="text-sm text-red-500 -mt-4">{errors.lastVaccinationDate.message}</p>}

        <Input
          label="Next Vaccination Date"
          type="date"
          min={new Date().toISOString().split("T")[0]}
          {...register("nextVaccinatonScheduleDate", {
            required: "Next Vaccination Date is required",
            validate: value => new Date(value) >= new Date().setHours(0,0,0,0) || "Date cannot be in the past",
          })}
        />
        {errors.nextVaccinatonScheduleDate && <p className="text-sm text-red-500 -mt-4">{errors.nextVaccinatonScheduleDate.message}</p>}
      </div>

      <div className="w-full max-w-md">
        <label className="block mb-1 text-sm font-medium text-gray-700">Notes</label>
        <textarea
          rows="3"
          placeholder="Any additional notes..."
          {...register("notes")}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="w-full max-w-md">
          <label className="block mb-1 text-sm font-medium text-gray-700">X-Ray Image</label>
          <input type="file" accept="image/*" {...register("XRay")} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
        </div>

        <div className="w-full max-w-md">
          <label className="block mb-1 text-sm font-medium text-gray-700">Report</label>
          <input type="file" accept="image/*" {...register("Reports")} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
        </div>

        <div className="w-full max-w-md">
          <label className="block mb-1 text-sm font-medium text-gray-700">Prescription</label>
          <input type="file" accept="image/*" {...register("Prescription", { required: "Prescription is required" })} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
        </div>
      </div>
      {errors.Prescription && <p className="text-sm text-red-500 -mt-4">{errors.Prescription.message}</p>}

      <div className="pt-4 flex justify-center">
        <Button type="submit" bgColor="bg-blue-600" textColor="text-white">
          Update Medical Info
        </Button>
      </div>
    </form>
  );
};

export default UpdatePetMedical;
