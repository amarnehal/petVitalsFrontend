import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; 
import authReducer from "./authSlice";
import vetReducer from "./vetSlice";
import petReducer from "./petSlice";

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth'], // only persist 'auth'
};

const persistedAuthReducer = persistReducer(persistConfig, authReducer);

const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
    vet: vetReducer,
    pet: petReducer,
  },
});

const persistor = persistStore(store);

export { store, persistor };
