import React from "react";
import Input from "./Input";

const MedicalImageUploader = ({
  label,
  name,
  onChange,
  error,
  progress,        //// pass progress prop to show upload progress 0 to 100
  isUploading,    //// Pass boolean prop to indicate if the upload is in progress
}) => {

  return (
    <div className="w-full max-w-md space-y-2">
      <Input
        label={label}
        type="file"
        accept="image/*"
        disabled={isUploading}
        onChange={(e)=>{
          if(e.target.files?.[0]){
            onChange(name,e.target.files[0])
          }
        }}
        className={`w-full border rounded-lg px-3 py-2 text-sm bg-white cursor-pointer file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 ${
          isUploading ? "opacity-50 cursor-not-allowed" : "border-gray-300"
        }`}
      />

       {/* Dynamic Progress Bar */}
      {isUploading && progress > 0 && (
        <div className="w-full space-y-1">
          <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs text-right text-gray-500 font-medium">
            {progress === 100 ? "Processing on server..." : `Uploading: ${progress}%`}
          </p>
        </div>
      )}

      {error && (
        <p className="text-sm text-red-500">
          {error}
        </p>
      )}
    </div>
  );
};

export default MedicalImageUploader;