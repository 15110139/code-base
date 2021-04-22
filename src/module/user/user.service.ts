import { BaseFunction } from "@internal/core/base-function-info/base-function-info.model";
import { BaseApplication } from "@internal/core/base-service/base-service.model";
import { UserEntity } from "@internal/database/entities/user.entity";
import { TOKEN_TYPE } from "@internal/shared/business/jwt.model";
import { SYSTEM_CODE } from "@internal/shared/business/system-code";
import { BadRequestException, Injectable } from "@nestjs/common";
import { UserDetailService } from "./user-detail.service";
import { UserRepository } from "./user.repository";

@Injectable()
export class UserService extends BaseApplication {
	constructor(
		private userRepo: UserRepository,
		private userDetailService: UserDetailService,
	) {
		super();
	}
	async execute(
		_identity: BaseFunction | null | undefined,
		data: { [key: string]: any },
	): Promise<any> {
		this.logger.log(`Data: ${JSON.stringify(data)}`);
		const result = await this.userDetailService
			.initTraceId(this.getTraceId())
			.execute(this.getIdentity, {
				username: "UserDetail",
			});
		this.logger.log(`Result get user detail: ${JSON.stringify(result)}`);
		return 10;
		// throw new Error("Method not implemented.");
	}
	public async getUserWithEmailAndPassword(
		email: string,
		password: string,
	): Promise<UserEntity> {
		const user = await this.userRepo.get({
			email,
			password,
		});
		if (!user) {
			throw new BadRequestException(SYSTEM_CODE.USER_NOT_FOUND);
		}
		return user;
	}

	public async createUser(email: string, password: string, type: TOKEN_TYPE) {
		if (await this.getUserWithEmail(email)) {
			this.logger.error(`Username exist in database`);
			throw new BadRequestException(SYSTEM_CODE.EMAIL_EXIST_SYSTEM);
		}

		const user = new UserEntity();
		user.email = email;
		user.user_type = type;
		user.password = password;

		await this.userRepo.create(user);
	}

	private async getUserWithEmail(email: string) {
		return await this.userRepo.get({
			email,
		});
	}
}
