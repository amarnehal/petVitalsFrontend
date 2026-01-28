import React, { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Input from '../Input';
import Button from '../Button';
import vetService from '../../services/vet';

const UpdateVetMedicalInfo = () => {
  const { userData, isAuthenticated, role } = useSelector(state => state.auth);
  const navigate = useNavigate();

  const { register, control, handleSubmit, setValue, watch } = useForm({
    defaultValues: {
      clinicalAddress: '',
      qualifications: [''],
      experienceYears: '',
      bio: '',
      availability: [{ date: '', slots: [''] }],
    }
  });

  const { fields: qualificationFields, append: appendQualification, remove: removeQualification } = useFieldArray({
    control,
    name: 'qualifications'
  });

  const { fields: availabilityFields, append: appendAvailability, remove: removeAvailability } = useFieldArray({
    control,
    name: 'availability'
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Fetch existing vet data to pre-fill form
  useEffect(() => {
    const fetchVetInfo = async () => {
      try {
        const response = await vetService.getVet();
        const data = response.data;
        if (data) {
          setValue('clinicalAddress', data.clinicAddress || '');
          setValue('qualifications', data.qualifications?.length ? data.qualifications : ['']);
          setValue('experienceYears', data.experienceYears || '');
          setValue('bio', data.bio || '');
          setValue('availability', data.availability?.length ? data.availability : [{ date: '', slots: [''] }]);
          
        }
      } catch (err) {
        setError('Failed to load existing profile.');
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated && role === 'vet') {
      fetchVetInfo();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, role, setValue]);

  const onSubmit = async (formData) => {
    try {
      setError('');
      setLoading(true);
      await vetService.updateVetInfo(formData);
      setSuccess(true);
      alert("Vet medical Info has been updated successfully")
      navigate('/dashboard/vet-profile');
    } catch (err) {
      setError('Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return <navigate to="/login" />;
  }

  if (role !== 'vet') {
    return (
      <div className="h-screen flex justify-center items-center text-red-600">
        Access denied: Only vets can update profile.
      </div>
    );
  }

  if (loading) {
    return (
      <div className="h-screen flex justify-center items-center text-gray-600">
        Loading...
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-8 bg-white rounded-lg shadow-lg mt-10">
      <h2 className="text-2xl font-bold text-teal-700 mb-6">Update Medical Profile</h2>

      {error && <div className="text-red-600 mb-4">{error}</div>}
      {success && <div className="text-green-600 mb-4">Profile updated successfully!</div>}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

        <Input label="Clinic Address" {...register('clinicalAddress')} />

        <div>
          <label className="block text-sm font-semibold text-teal-700 mb-1">Qualifications</label>
          {qualificationFields.map((field, index) => (
            <div key={field.id} className="flex items-center gap-2 mb-2">
              <input
                {...register(`qualifications.${index}`)}
                className="border rounded p-2 w-full"
                placeholder="Qualification"
              />
              <Button type="button" bgColor="bg-red-500" textColor="text-white" onClick={() => removeQualification(index)}>
                Remove
              </Button>
            </div>
          ))}
          <Button type="button" bgColor="bg-teal-600" textColor="text-white" onClick={() => appendQualification('')}>
            Add Qualification
          </Button>
        </div>

        <Input
          label="Experience (in years)"
          type="number"
          {...register('experienceYears')}
        />

        <div>
          <label className="block text-sm font-semibold text-teal-700 mb-1">Bio</label>
          <textarea
            {...register('bio')}
            rows={4}
            className="border rounded p-2 w-full"
            placeholder="Write something about yourself..."
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-teal-700 mb-1">Availability (Dates & Slots)</label>
          {availabilityFields.map((field, index) => (
            <div key={field.id} className="border rounded p-4 mb-4">
              <Input
                label="Date"
                type="date"
                {...register(`availability.${index}.date`)}
              />

              <div className="mt-2">
                <label className="block text-sm font-semibold text-teal-700 mb-1">Slots (comma separated)</label>
                <input
                  {...register(`availability.${index}.slots`)}
                  className="border rounded p-2 w-full"
                  placeholder="e.g., 10:00 AM, 2:00 PM"
                />
              </div>

              <Button type="button" bgColor="bg-red-500" textColor="text-white" onClick={() => removeAvailability(index)} className="mt-2">
                Remove
              </Button>
            </div>
          ))}

          <Button type="button" bgColor="bg-teal-600" textColor="text-white" onClick={() => appendAvailability({ date: '', slots: [''] })}>
            Add Availability
          </Button>
        </div>

        <Button type="submit" bgColor="bg-teal-600" textColor="text-white">
          Save Changes
        </Button>
      </form>
    </div>
  );
};

export default UpdateVetMedicalInfo;
