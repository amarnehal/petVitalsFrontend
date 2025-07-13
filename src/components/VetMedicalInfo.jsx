import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

import vetService from '../services/vet'
import { addVetMedicalInfo } from '../store/vetSlice'

import Input from './Input'
import DateAndSlot from './DateAndSlot'
import Button from './Button'

const VetMedicalInfo = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [availability, setAvailability] = useState([])

  const { register, handleSubmit, formState: { errors } } = useForm()
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const addVetMedicalDetails = async (data) => {
    setError(null)

    if (availability.length === 0) {
      setError('Please select at least one date and slot.')
      return
    }

    const formData = {
      ...data,
      availability,
    }

    console.log('Vet Medical form info is here -----------', formData)

    try {
      setLoading(true)
      const userData = await vetService.vetMedicalInfo(formData)

      if (userData) {
        dispatch(addVetMedicalInfo(userData))
        navigate('/dashboard') // optional: navigate after success
      }
    } catch (error) {
      setError(error.message || "Failed to create vet's medical record")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
          Add Vet Medical Info
        </h2>

        {error && (
          <p className="text-red-600 text-sm mb-4 text-center">{error}</p>
        )}

        <form onSubmit={handleSubmit(addVetMedicalDetails)} className="mt-8 space-y-5">
          <Input
            label="Qualifications:"
            placeholder="Enter your qualification"
            {...register("qualifications", {
              required: "Qualifications are required",
            })}
            error={errors.qualifications}
          />

          <Input
            label="Experience (Years):"
            type="number"
            placeholder="Experience in years"
            {...register("experienceYears", {
              required: "Experience in years is required",
              min: { value: 1, message: "Must be at least 1 year" },
            })}
            error={errors.experienceYears}
          />

          <DateAndSlot onAvailabilityChange={setAvailability} />

          <Input
            label="Clinic Address:"
            placeholder="Enter clinic address"
            {...register("clinicAddress", {
              required: "Clinic Address is required",
            })}
            error={errors.clinicAddress}
          />

          <Input
            label="Bio:"
            placeholder="Please provide your bio"
            {...register("bio", {
              required: "Bio is required",
            })}
            error={errors.bio}
          />

          <Button type="submit" disabled={loading}>
            {loading ? 'Submitting...' : 'Add Vet Medical Info'}
          </Button>
        </form>
      </div>
    </div>
  )
}

export default VetMedicalInfo
