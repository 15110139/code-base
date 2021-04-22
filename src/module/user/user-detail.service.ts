import { BaseFunction } from "@internal/core/base-function-info/base-function-info.model";
import { BaseApplication } from "@internal/core/base-service/base-service.model";
import { Injectable } from "@nestjs/common";

@Injectable()
export class UserDetailService extends BaseApplication {
	public async execute(
		_identity: BaseFunction | null | undefined,
		data: { [key: string]: any },
	): Promise<any> {
		this.logger.log(`Test user service: ${JSON.stringify(data)}`);
	}
}
