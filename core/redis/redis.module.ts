import { Module, OnModuleInit } from "@nestjs/common";
import * as redis from "redis";
import { EnvironmentsProvider } from "../environment/environment.service";
import { RedisService } from "./redis.service";

const connectionRedisProvider = {
	useFactory: async () => {
		console.log("Start connection with redis");
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
	async onModuleInit() {
		try {
			await connectionRedisProvider.useFactory();
		} catch (error) {
			console.log(error);
			throw error;
		}
	}
}
