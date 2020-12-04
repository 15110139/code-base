import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { EnvironmentsService } from "../environment/environment.service";
import { JWTPayload } from "./auth.model";
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(public envService: EnvironmentsService) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: true,
			secretOrKey: envService.ENVIRONMENTS.JWT_SECRET,
		});
	}

	async validate(payload: JWTPayload) {
		return payload;
	}
}
