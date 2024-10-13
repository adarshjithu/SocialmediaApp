import { IUser } from "../../Models/userModel";

export interface IUserRepository {
     emailExist(email: string): Promise<IUser | null>;
     saveUser(data: IUser): Promise<Partial<IUser> | null>;
     checkEmail(email: string): Promise<IUser | null>;
     findById(id: string): Promise<IUser | null>;
     updatePassword(newPassword: string, userId: string): Promise<any>;
     createUser(userData:any): Promise<Record<string,any>|null>
}
