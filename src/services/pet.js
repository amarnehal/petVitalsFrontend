import axios from "axios";

class Pet{
 constructor() {
     this.baseUrl = import.meta.env.VITE_API_BASE_URL; // e.g. http://localhost:5000/api/v1 
    this.api = axios.create({
      baseURL: this.baseUrl,
      withCredentials: true, //  for cookies
    })
 }
 /// pet basic profile creation 
 async createPet(userName, email, phoneNumber, petType, name, age, gender){
    try {
     const res =  await this.api.post("/pet/register",{userName, email, phoneNumber, petType, name, age, gender})
      if (res.status === 201) {
      return res.data; // Successful response
    } else {
      throw new Error(res.data.message || "Failed to register pet");
    }
    } catch (error) {
        console.log("Error occured while creating the pet",error.message);
        throw error.message || "Something went wrong while creating the Pet"
        
    }
 }
 //// pet basic profile updation
 async updatePet( id,petName, age, gender){
    try {
       const res = await this.api.post(`/pet/update/${id}`,{ petName, age, gender})
    } catch (error) {
        console.log("error occured while updating the pet profile");
        
    }
 }
  ///// pet medical info creation //////
 async createPetMedicalInfo (petId,data){
   console.log("pet Id ,And Pet Data from service layer medical record ❤️❤️❤️",petId,data);
   
    try {
    const response =  await this.api.post(`/pet/medicalinfo/${petId}`,data)
    console.log("Direct response from service",response);
    
    return response.data
    } catch (error) {
       console.log("Error occured while creating pet's medical record",error);
         throw new Error(error?.response?.data?.message || error.message || "Error occured while creating the medical record")
    }
 }

 //// update PetMedicalProfile /////
   async updatePetMedicalInfo(id,data){
      try {
       const response =  await this.api.patch(`/pet/update/medicalinfo/${id}`,
            data
         )
         if(!response.data){
             throw new Error(error?.response?.data?.message  || "Error occured while updating the medical record")
         }
         return response.data
      } catch (error) {
         console.log("Error occured while updating pet's medical record",error);
         throw new Error(error?.response?.data?.message || error.message || "Error occured while updating the medical record")
      }
   }

  ///// get pet info with all the details and medical info ///
  async getPetInfo(id){
   try {
    const res = await this.api.get(`/pet/petdetails/${id}`)
    if(!res.data){
      throw new Error("Failed to fetch pet details")
    }
    return res.data;
   } catch (error) {
      console.log("Failed to fetch pet's info at service layer error -");
      throw new Error(error?.response?.data?.message || error.message || "An error occurred")
   }
  }
  /////// remove pet ///////////////////////////
  async removePet(id){
   try {
    const res =  await this.api.delete(`/pet/removepet/${id}`)
    console.log("res from remove pet",res);
    
    if(res.status !== 200){
      throw new Error("Failed to delete the pet")
    }
    return res.data
   } catch (error) {
       console.log("Failed to remove pet profile error occured -",error);
      throw new Error(error?.response?.data?.message || error.message || "Failed to remove pet profile error occured ")
   }
  }
}



const petService = new Pet();

export default petService;