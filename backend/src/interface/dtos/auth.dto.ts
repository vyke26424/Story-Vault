import { IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class Register {
    @IsString()
    @IsEmail()
    @IsNotEmpty()
    email : string
    @IsString()
    @IsNotEmpty()
    password :string
    @IsString()
    @IsOptional()
    name : string
}

export class SignIn {
    @IsString()
    @IsNotEmpty()
    @IsEmail()
    email : string
    @IsString()
    @IsNotEmpty()
    password : string
}

