import axios from "axios";

class Vet {
  constructor() {
    this.baseUrl = import.meta.env.VITE_API_BASE_URL; // e.g. http://localhost:5000/api/v1
    this.api = axios.create({
      baseURL: this.baseUrl,
      withCredentials: true, //
    });
  }
  

  //// user and pet registeration by vet ////
  async registerUserPet(data) {
    console.log("Data recieved in service layer from regiter user pet",data);
    
    try {
      const res = await this.api.post("/vet/register-user-pet",data);

      return res.data;
    } catch (error) {
      console.log("Error occured while registring pet and the user",error.message);
      const msg = error.response?.data?.message || "Failed to create user and Pet "
      throw new Error(msg);
    }
  }

  ////users-with-pets /// get all info about users and pets
  async getAllUsersAndPets() {
    try {
      const res = await this.api.get("/vet/users-with-pets");
      return res.data;
    } catch (error) {
      const msg = error.response?.data?.message || "Failed to get owner and the pet details "
      throw new Error(msg);
    }
  }

  //// register vet's medical details ///
  async vetMedicalInfo(formData) {
    console.log("Form data recieved in Vet Medical info service",formData);
    
    try {
      const res = await this.api.post("/vet/registermedicalinfo", formData);
      return res.data;
    } catch (error) {
      console.error("Vet Medical Info service error ---",error)

       const message =
      error.response?.data?.message || "Failed to register vet medical info";
      throw  new Error(message);
    }
  }

  /// get vet Info by users to check vet's availability //
  async getVetInfoByUser(id){
    try {
    const res = await this.api.get(`/vet/vetinfobyuser/${id}`)
    return res.data
    } catch (error) {
      console.error("Error occured in get vet info by user in service class",error)

      const message = error.response?.data?.message || "Failed to get vet information"
        throw new Error(message)
    }
  }

  ////get vetInfo by logedin Vet ///
   async getVet(){
      console.log("Request is getting inside the get vet service");
      
    try {
        const res = await this.api.get("/vet/vetinfo")
        console.log("get vet service 🧑‍⚕️🧑‍⚕️🧑‍⚕️🧑‍⚕️",res);
        
        return res.data
    } catch (error) {
       const msg = error.response?.data?.message || "Failed to get vet information "
       console.log("Failed to get vet info",error.message);
       
      throw new Error(msg);
    }
   }

   /// update vet basic profile ///
   async updateVetProfile( data){
    const { userName, email, phoneNumber, password} = data
    try {
     const resp = await this.api.put("/vet/updateVet",{ userName, email, phoneNumber, password})
     return resp.data
    } catch (error) {
        const msg = error.response?.data?.message || "Failed to update vet profile "
      throw new Error(msg);
    }
   }

   ///// update vet medical Profile////

   async updateVetInfo(formData){
    try {
        const res = await this.api.put("/vet/updatevetinfo",formData)
        return res.data
    } catch (error) {
        const msg = error.response?.data?.message || "Failed to update vet medical info "
      throw new Error(msg);
    }
   }

   ///// remove vet /////////
   async removeVet(){
    try {
     const res = await this.api.delete("/vet/remove")
     return res.data
    } catch (error) {
        const msg = error.response?.data?.message || "Failed to remove vet"
      throw new Error(msg);
    }
   }

}

const vetService = new Vet();

export default vetService;
