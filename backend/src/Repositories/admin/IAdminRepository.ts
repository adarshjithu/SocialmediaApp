import { AdminInterface } from "../../Inteface/IAdmin";

export interface IAdminRepository {
     blockUser(userId: string): Promise<null | Record<string, any>>;
     deleteUser<T>(userId: T): Promise<Record<string, any> | null>;
     getAdminByEmail(email: string): Promise<AdminInterface | null | undefined>;
     getAllUsers(page: number, type: string,search:string): Promise<any>;
}
