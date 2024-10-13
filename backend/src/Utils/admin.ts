import { Admin } from "../Models/adminModel";
import { hashPassword } from "./password";

export const createAdmin = async(admin:Record<string,any>)=>{
try{
const password =  await hashPassword(admin.password);
  admin.password = password
await Admin.create(admin);
}catch(error){
    console.log(error as Error)
}
}