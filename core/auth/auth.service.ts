import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { EnvironmentsService } from "../environment/environment.service";
import { JWTPayload } from "./auth.model";

@Injectable()
export class AuthService {
	constructor(
		private readonly jwtService: JwtService,
		private readonly envService: EnvironmentsService,
	) {}

	public async signJWTToken(content: JWTPayload) {
		return this.signContent(
			content,
			this.envService.ENVIRONMENTS.EXPIRE_TIME,
		);
	}

	private async signContent(
		content: JWTPayload,
		expire: number,
	): Promise<string> {
		return this.jwtService.sign(content, {
			audience: this.envService.ENVIRONMENTS.JWT_ISSUER,
			subject: this.envService.ENVIRONMENTS.JWT_ISSUER,
			issuer: this.envService.ENVIRONMENTS.JWT_ISSUER,
			expiresIn: expire,
		});
	}
}
