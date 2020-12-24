import { Body, Controller, Post } from "@nestjs/common";
import { ResponseApiInterface } from "@internal/shared/api-interface/base-api-interface";
import {
	UserLoginBodyRequest,
	UserSignInURL,
	UserSignResponse,
} from "@internal/shared/api-interface/auth/sign-in-api-interface";
import {
	UserSignInBodyRequest,
	UserSignInResponse,
	UserSignUpURL,
} from "@internal/shared/api-interface/auth/sign-up-api-interface";
import { SYSTEM_CODE } from "@internal/shared/business/system-code";
import { AuthService } from "@internal/core/auth/auth.service";
import { UserService } from "../user/user.service";
import { UserJWTPayload } from "@internal/core/auth/auth.model";
import { Public } from "@internal/core/auth/auth.decorator";
import { TOKEN_TYPE } from "@internal/shared/business/jwt.model";
import {
	PERMISSION,
	SYSTEM_ROLE,
} from "@internal/shared/business/role-permission";

@Controller()
export class UserAuthController {
	constructor(
		private authService: AuthService,
		private userService: UserService,
	) {}

	@Public()
	@Post(UserSignInURL)
	public async userLogin(
		@Body() body: UserLoginBodyRequest,
	): Promise<UserSignResponse> {
		const user = await this.userService.getUserWithEmailAndPassword(
			body.email,
			body.password,
		);
		const content = new UserJWTPayload(user.id, user.user_type);
		content.time = new Date().getTime();
		content.privilege =
			user.user_type === TOKEN_TYPE.PRO
				? {
						permission: [
							PERMISSION.CREATE,
							PERMISSION.DELETE,
							PERMISSION.EDIT,
							PERMISSION.GET,
						],
						role: SYSTEM_ROLE.ADMIN,
				  }
				: {
						permission: [PERMISSION.GET],
						role: SYSTEM_ROLE.USER,
				  };
		return {
			token: await this.authService.signJWTToken(content),
		};
	}

	@Public()
	@Post(UserSignUpURL)
	public async userSign(
		@Body() body: UserSignInBodyRequest,
	): Promise<ResponseApiInterface<UserSignInResponse>> {
		await this.userService.createUser(body.email, body.password, body.type);
		return new ResponseApiInterface({}, "", SYSTEM_CODE.SUCCESS);
	}
}
