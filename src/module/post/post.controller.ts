import { JWTPayload } from "@internal/core/auth/auth.model";
import { Controller, Get, Query, UseGuards } from "@nestjs/common";
import {
	ListPostQuery,
	ListPostURL,
} from "@internal/shared/api-interface/post/find-post-interface";
import { CreateHouseAndStreet } from "./usecase/create-post.usecase";
import { TOKEN_TYPE } from "@internal/shared/business/jwt.model";
import { JWTContent, Public } from "@internal/core/auth/auth.decorator";
import { AuthGuard } from "@nestjs/passport";
import {
	PermissionRequireGuard,
	RequirePermission,
} from "@internal/core/auth/permission.guard";
import {
	PERMISSION,
	SYSTEM_ROLE,
} from "@internal/shared/business/role-permission";
import { RootBaseFunction } from "@internal/core/base-function-info/base-function-info.model";
@Controller()
@UseGuards(AuthGuard())
export class PostController {
	constructor(private createHouseAndStreet: CreateHouseAndStreet) {}

	@Public()
	@UseGuards(PermissionRequireGuard)
	@RequirePermission([
		{
			role: SYSTEM_ROLE.ADMIN,
			permission: [PERMISSION.CREATE, PERMISSION.DELETE],
		},
	])
	@Get(ListPostURL)
	public async listPost(
		@Query() query: ListPostQuery,
		@JWTContent(JWTPayload) _jwtPayload: JWTPayload,
	) {
		return await this.createHouseAndStreet.execute(
			new RootBaseFunction(),
			TOKEN_TYPE.NORMAL,
			{
				page: query?.page || 1,
				pageSize: query?.pageSize || 10,
			},
			query,
		);
	}
}
