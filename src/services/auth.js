import axios from "axios";

console.log("ENV enviornment",import.meta.env.VITE_API_BASE_URL);

class AuthService {
  constructor() {
    this.baseUrl = import.meta.env.VITE_API_BASE_URL;
    this.api = axios.create({
      baseURL: this.baseUrl,
      withCredentials: true,
    });
  }

  ////// registeration ////
  async registerUser(data) {
    try {
      const res = await this.api.post("/user/register", data);
      if (res.status === 201) {
        return res.data;
      } else {
        throw new Error("Error occurred while creating the user");
      }
    } catch (error) {
      throw new Error(error?.response?.data?.message || error.message);
    }
  }

   ///// login function ////
  async loginUser(data) {
    
    try {
      const res = await this.api.post("/user/login", data);
      console.log("here is the res data",res.data);
          
      return res.data;
    } catch (error) {
      throw new Error(error?.response?.data?.message || error.message);
    }
  }

  ////// verify user////////////////
  async verifyUser(token) {
    try {
      const res = await this.api.get(`/user/verifyUser/${token}`);
      return res.data;
    } catch (error) {
      throw new Error(error?.response?.data?.message || error.message);
    }
  }

  //// get user profile //////
  async getUserProfile() {
    try {
      const res = await this.api.get("/user/getuser");
      return res.data;
    } catch (error) {
      console.log("error ocurrent in getting user Profile ------",error);
      
      throw new Error(error?.response?.data?.message || error.message);
    }
  }

  async resetPassword(token, password) {
    try {
      const res = await this.api.post(`/user/resetpassword/${token}`, { password });
      return res.data;
    } catch (error) {
      throw new Error(error?.response?.data?.message || error.message);
    }
  }

  async forgotPassword(email) {
    try {
      const res = await this.api.post("/user/forgotpassword", { email });
      return res.data;
    } catch (error) {
      throw new Error(error?.response?.data?.message || error.message);
    }
  }

  //// logout //////

  async logOut() {
    try {
      const res = await this.api.get("/user/logout");
      console.log("res.data from log out",res.data);
      
      return res.data;
    } catch (error) {
      throw new Error(error?.response?.data?.message || error.message);
    }
  }

  ///// user can claim account ////

  async claimAccount(token, newPassword) {
    try {
      const res = await this.api.post(`/claim-account/${token}`, { newPassword });
      return res.data;
    } catch (error) {
      throw new Error(error?.response?.data?.message || error.message);
    }
  }
}

const authService = new AuthService();
export default authService;
