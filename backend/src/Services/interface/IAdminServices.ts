import { ServiceResponse } from "../../Inteface/IAdmin";
import { IUser } from "../../Models/userModel";


export interface IAdminServices{
    getAllUsers(page: number , type: string ,search:string): Promise<IUser[] | null | undefined>
    blockUser(userId: string): Promise<ServiceResponse | null | undefined>
    deleteUser<T>(userId: T): Promise<Record<string, any> | undefined | null> 
    login<T>(adminData: { email: string; password: string }): Promise<Record<string, any> | undefined>
}