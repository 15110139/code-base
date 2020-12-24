import { Inject, Injectable, Logger } from "@nestjs/common";
import { RedisClient } from "redis";
@Injectable()
export class RedisService {
	private logger = new Logger(RedisService.name);
	constructor(
		@Inject("REDIS_CONNECTION") private readonly redisClient: RedisClient,
	) {}

	public async add(
		key: string,
		value: string,
		duration: number,
	): Promise<{ error: Error | null; result: string | undefined }> {
		return await new Promise((resolve, _reject) => {
			this.redisClient.set(
				key,
				value,
				"hand",
				duration,
				(error, result) => {
					if (error) {
						this.logger.error(
							`Error Cache set fail with key: ${key} and value is: ${value}`,
						);
					} else {
						this.logger.log(
							`Cache set success with key: ${key} and value is: ${value}`,
						);
					}
					resolve({
						error: error,
						result: result,
					});
				},
			);
		});
	}

	public async get(key: string) {
		return await new Promise((resolve, _reject) => {
			this.redisClient.get(key, (error, data) => {
				if (error) {
					this.logger.error(`Error Cache get fail with key: ${key}`);
				} else {
					this.logger.log(
						`Cache get success with key: ${key} == data is: ${data}`,
					);
				}
				resolve({
					error: error,
					result: data,
				});
			});
		});
	}

	public async del(key: string | string[]) {
		return await new Promise((resolve, _reject) => {
			this.redisClient.del(key, (error, key) => {
				if (error) {
					this.logger.error(
						`Cache delete fail with key: ${String(key)}`,
					);
				} else {
					this.logger.log(
						`Cache delete success with key: ${String(key)}`,
					);
				}
				resolve({
					error: error,
					result: key,
				});
			});
		});
	}
}
