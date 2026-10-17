export interface User {
    id: string;
    name: string;
    email: string;
    password: string;
    mobile?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface RegisterUser {
    email: string;
    password: string;
    name: string;
    mobile?: string;
}

export interface LoginUser {
    email: string;
    password: string;
}

export interface JWTpayload {
    userid: string;
    email?: string;
}