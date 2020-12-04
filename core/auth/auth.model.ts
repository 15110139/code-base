import { TOKEN_TYPE } from "@internal/shared/business/jwt.model";

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
