import {
	IRequirePrivilege,
	PERMISSION,
} from "@internal/shared/business/role-permission";
import { SYSTEM_CODE } from "@internal/shared/business/system-code";
import {
	CanActivate,
	ExecutionContext,
	ForbiddenException,
	Injectable,
	SetMetadata,
	UnauthorizedException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import { UserJWTPayload } from "./auth.model";

export const PERMISSION_LIST_KEY = "PERMISSION_LIST_KEY";

export const RequirePermission = (requirePrivilege: IRequirePrivilege[]) =>
	SetMetadata(PERMISSION_LIST_KEY, requirePrivilege);

@Injectable()
export class PermissionRequireGuard implements CanActivate {
	constructor(private reflector: Reflector) {}
	public canActivate(
		context: ExecutionContext,
	): boolean | Promise<boolean> | Observable<boolean> {
		const request = context.switchToHttp().getRequest();
		const requirePrivilege: IRequirePrivilege[] = this.reflector.get<
			IRequirePrivilege[]
		>(PERMISSION_LIST_KEY, context.getHandler());
		if (!requirePrivilege) {
			return true;
		}
		if (!request.user) {
			throw new ForbiddenException(SYSTEM_CODE.CANT_VERIFY_PERMISSION);
		}
		const privilege = (request.user as UserJWTPayload).privilege;
		if (!privilege) {
			throw new ForbiddenException(SYSTEM_CODE.CANT_VERIFY_PERMISSION);
		}

		if (!checkPrivilege(requirePrivilege, privilege)) {
			throw new UnauthorizedException(SYSTEM_CODE.PERMISSION_DENIED);
		}

		return true;
	}
}

function checkPrivilege(
	requirePrivilege: IRequirePrivilege[],
	userPrivilege: IRequirePrivilege,
): boolean {
	const indexRole = requirePrivilege
		.map(el => el.role)
		.findIndex(el => el === userPrivilege.role);
	if (indexRole === -1) {
		return false;
	} else {
		const permission = requirePrivilege[indexRole].permission;
		const havePermission = (permission: PERMISSION) =>
			userPrivilege.permission.includes(permission);
		return permission.every(havePermission);
	}
}
