import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isVet: false,
  petBasicInfo: null,
  petMedicalInfo: null,
  petAndUserInfo: null,
  petInfo: null, //
};

const petSlice = createSlice({
  name: "pet",
  initialState,
  reducers: {
    /// vet can create partial user and pet info
    createUserAndPetInfo(state, action) {
      state.isVet = true;
      state.petAndUserInfo = action.payload?.data || null;
    },
    //// for vet route only to access both the pet and user details
    getUserAndPetInfo(state, action) {
      state.isVet = true;
      state.petAndUserInfo = { petDetails: action.payload }; // ✅ store as { petDetails: [...] }
    },

    ///// for user to add pet ////
    createPet(state, action) {
      state.isVet = false;
      state.petBasicInfo = action.payload?.data || null;
    },
    //// add pet medical record by vet////
    createPetMedicalRecord(state, action) {
      state.isVet = true;
      state.petMedicalInfo = action.payload?.data || null;
    },
    /// update pet medical Info ///
    updatePetMedicalInfo(state, action) {
      state.petMedicalInfo = action.payload || null;
    },
    /////get pet all info /////
    getPetInfo(state, action) {
      state.isVet = true;
      state.petInfo = action.payload || null;
    },
    removePet(state, action) {
      const petIdToRemove = action.payload;

      if (Array.isArray(state.petBasicInfo)) {
        state.petBasicInfo = state.petBasicInfo.filter(
          (pet) => pet.id !== petIdToRemove
        );
      }

      if (Array.isArray(state.petMedicalInfo)) {
        state.petMedicalInfo = state.petMedicalInfo.filter(
          (info) => info.petId !== petIdToRemove
        );
      }
    },
  },
});

export const {
  createUserAndPetInfo,
  getUserAndPetInfo,
  createPet,
  createPetMedicalRecord,
  getPetInfo,
  updatePetMedicalInfo,
  removePet,
} = petSlice.actions;

export default petSlice.reducer;
