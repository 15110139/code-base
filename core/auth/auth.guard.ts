import { SYSTEM_CODE } from "@internal/shared/business/system-code";
import {
	BadRequestException,
	CanActivate,
	ExecutionContext,
	Injectable,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { IS_PUBLIC_KEY } from "./auth.decorator";

@Injectable()
export class JwtGuardPublic implements CanActivate {
	constructor(private reflector: Reflector) {}
	public canActivate(context: ExecutionContext) {
		const isPublic = this.reflector.getAllAndOverride<boolean>(
			IS_PUBLIC_KEY,
			[context.getHandler(), context.getClass()],
		);
		if (!isPublic) {
			throw new BadRequestException(
				SYSTEM_CODE.API_NOT_PUBLIC_IN_VERSION,
			);
		}
		return true;
	}
}
