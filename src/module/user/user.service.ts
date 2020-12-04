import { UserEntity } from "@internal/database/entities/user.entity";
import { TOKEN_TYPE } from "@internal/shared/business/jwt.model";
import { SYSTEM_CODE } from "@internal/shared/business/system-code";
import { BadRequestException, Injectable, Logger } from "@nestjs/common";
import { UserRepository } from "./user.repository";

@Injectable()
export class UserService {
	private logger = new Logger(UserService.name);

	constructor(private userRepo: UserRepository) {}
	public async getUserWithEmailAndPassword(
		email: string,
		password: string,
	): Promise<UserEntity> {
		return {} as UserEntity;
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
