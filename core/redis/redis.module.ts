import { Module, OnModuleInit } from "@nestjs/common";
import * as redis from "redis";
import { LoggerService } from "../base-service/logger.service";
import { EnvironmentsProvider } from "../environment/environment.service";
import { RedisService } from "./redis.service";

const connectionRedisProvider = {
	useFactory: async (logger: LoggerService) => {
		logger.log("Start connection with redis");
		return redis.createClient({
			host: EnvironmentsProvider.useValue.ENVIRONMENTS.REDIS_HOST,
			port: EnvironmentsProvider.useValue.ENVIRONMENTS.REDIS_PORT,
		});
	},
	provide: "REDIS_CONNECTION",
};

@Module({
	providers: [connectionRedisProvider, RedisService],
	exports: [RedisService],
})
export class RedisModule implements OnModuleInit {
	private logger = new LoggerService().setContext(this.constructor.name);
	async onModuleInit() {
		try {
			await connectionRedisProvider.useFactory(this.logger);
		} catch (error) {
			console.log(error);
			throw error;
		}
	}
}
