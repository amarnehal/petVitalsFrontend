import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isVet: false,
  vetInfo: null,       // ✅ new key for vet profile info
  vetMedicalInfo: null,
  vetBasicInfo: null,
};

const vetSlice = createSlice({
  name: "vet",
  initialState,
  reducers: {
    getVet(state, action) {
      state.isVet = true;
      state.vetInfo = action.payload || null;   // ✅ store the actual vet data
    },
    addVetMedicalInfo(state, action) {
      state.isVet = true;
      state.vetMedicalInfo = action.payload || null;
    },
    addVetBasicInfo(state, action) {
      state.isVet = true;
      state.vetBasicInfo = action.payload || null;
    },
    getVetMedicalInfo(state, action) {
      state.isVet = true;
      state.vetMedicalInfo = action.payload || null;
    },
    updateVetBasicInfo(state, action) {
      state.isVet = true;
      state.vetBasicInfo = action.payload || null;
    },
    getVetBasicInfo(state, action) {
      state.isVet = true;
      state.vetBasicInfo = action.payload || null;
    },
  },
});

export const {
  getVet,
  addVetMedicalInfo,
  addVetBasicInfo,
  getVetMedicalInfo,
  updateVetBasicInfo,
  getVetBasicInfo,
} = vetSlice.actions;

export default vetSlice.reducer;
