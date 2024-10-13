
export interface AdminInterface {
    name?:string;
    email:string;
    phonenumber?:string;
    password:string;
    _id?:string
}

export interface ServiceResponse { 
    success: boolean;
    message: string;
    admin?: AdminInterface;
    adminAccessToken?: string;
}

export type IRespone = Record<string,any>|null
export interface IPostRespone{
    success?:boolean;
    
}


export interface PostInfo {
    likes:any
    comments:Record<string,any>[]
}

export interface IDashboard {
    totalPost:number
    totalUsers:number;
    totalComments:number;
    totalLikes:number;
    todayPostCount:number;
    todayUserCount:number;
    monthlyUser:Record<string,any>;
    monthlyPost:Record<string,any>;
}