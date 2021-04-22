import { Public } from "@internal/core/auth/auth.decorator";
import { Controller, Get } from "@nestjs/common";
import { v4 } from "uuid";
import { UserService } from "./user.service";

@Controller("user")
export class UserController {
	constructor(
		private userService: UserService,
	) {}

	@Get("/test")
	@Public()
	public async getUser() {
		console.log("Start test log");
		return await this.userService.initTraceId(v4()).execute(null, {});
	}
}
