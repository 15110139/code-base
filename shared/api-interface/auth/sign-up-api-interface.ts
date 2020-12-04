import { Exclude, Expose } from "class-transformer";
import {
	IsDefined,
	IsEmail,
	IsEnum,
	IsString,
	MinLength,
} from "class-validator";
import { TOKEN_TYPE } from "@internal/shared/business/jwt.model";

@Exclude()
export class UserSignInBodyRequest {
	@Expose()
	@IsString()
	@IsEmail()
	@IsDefined()
	@MinLength(8)
	public email!: string;

	@Expose()
	@IsString()
	@IsDefined()
	@MinLength(6)
	public password!: string;

	@Expose()
	@IsDefined()
	@IsEnum(TOKEN_TYPE)
	public type!: TOKEN_TYPE;
}

@Exclude()
export class UserSignInResponse {}

export const UserSignUpURL = "auth/sign-up";
