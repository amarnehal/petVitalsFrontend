import React from "react";
import { useDispatch } from "react-redux";
import auth from "../../services/auth";
import { logout } from "../../store/authSlice";
import { persistor } from "../../store/store";

const LogOutBtn = () => {
  const dispatch = useDispatch();

  const logOutHandler = () => {
    auth
      .logOut()
      .then(() => {
        dispatch(logout());
        persistor.purge();  // 💡 clears persisted storage
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <button
      className="flex items-center px-4 py-2 bg-red-500 text-white rounded-lg shadow hover:bg-red-600 transition duration-200 active:scale-95"
      onClick={logOutHandler}
    >
      LogOut
    </button>
  );
};

export default LogOutBtn;
