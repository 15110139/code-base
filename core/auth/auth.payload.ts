import { Exclude, Expose, Type } from "class-transformer";
import { JWTPayload } from "./auth.model";

@Exclude()
export class UserTokenRequest {
	@Expose()
	@Type(() => JWTPayload)
	user: JWTPayload;
}
