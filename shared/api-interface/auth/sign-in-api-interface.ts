import { Exclude, Expose } from "class-transformer";
import {
	IsDefined,
	IsEmail,
	IsString,
	MinLength,
} from "class-validator";

@Exclude()
export class UserLoginBodyRequest {
	@Expose()
	@IsEmail()
	@IsDefined()
	@MinLength(4)
	public email!: string;

	@Expose()
	@IsString()
	@IsDefined()
	@MinLength(6)
	public password!: string;
}

@Exclude()
export class UserSignResponse {
	@Expose()
	@IsString()
	@IsDefined()
	public token!: string;
}

export const UserSignInURL: string = "auth/sign-in";
