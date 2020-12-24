import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy, StrategyOptions } from "passport-jwt";
import { EnvironmentsService } from "../environment/environment.service";
import { JWTPayload } from "./auth.model";
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(public envService: EnvironmentsService) {
		super({
			jwtFromRequest:
				ExtractJwt.fromAuthHeaderAsBearerToken() ||
				ExtractJwt.fromUrlQueryParameter("token"),
			ignoreExpiration: true,
			passReqToCallback: true,
			secretOrKey: envService.ENVIRONMENTS.JWT_SECRET,
		} as StrategyOptions);
	}

	async validate(_req: Request, payload: JWTPayload): Promise<JWTPayload> {
		return payload;
	}
}
