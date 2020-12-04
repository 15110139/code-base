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
import { JWTPayload } from "@internal/core/auth/auth.model";

@Controller()
export class UserAuthController {
	constructor(
		private authService: AuthService,
		private userService: UserService,
	) {}

	@Post(UserSignInURL)
	public async userLogin(
		@Body() body: UserLoginBodyRequest,
	): Promise<UserSignResponse> {
		const user = await this.userService.getUserWithEmailAndPassword(
			body.email,
			body.password,
		);

		const content: JWTPayload = {
			time: new Date().getTime(),
			type: user.user_type,
			user_id: user.id,
		};

		return {
			token: await this.authService.signJWTToken(content),
		};
	}

	@Post(UserSignUpURL)
	public async userSign(
		@Body() body: UserSignInBodyRequest,
	): Promise<ResponseApiInterface<UserSignInResponse>> {
		await this.userService.createUser(body.email, body.password, body.type);
		return new ResponseApiInterface({}, "", SYSTEM_CODE.SUCCESS);
	}
}
