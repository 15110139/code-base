import { TOKEN_TYPE } from "@internal/shared/business/jwt.model";
import { IRequirePrivilege } from "@internal/shared/business/role-permission";
import { Exclude, Expose } from "class-transformer";
import { IsString, ValidateNested } from "class-validator";

export class JWTPayload {
	public readonly type!: TOKEN_TYPE;

	public time!: number;

	public exp?: number;

	public iat?: number;

	public aud?: string;

	public iss?: string;

	public sub?: string;

	public user_id!: string;

	constructor(userId: string, type: TOKEN_TYPE) {
		this.user_id = userId;
		this.type = type;
	}
}

@Exclude()
export class UserJWTPayload extends JWTPayload {
	@IsString()
	@Expose()
	public user_id!: string;

	@IsString()
	@Expose()
	public username!: string;

	@Expose()
	@ValidateNested({ each: true })
	public privilege!: IRequirePrivilege;
}
