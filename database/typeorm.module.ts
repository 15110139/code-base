import { TypeOrmModule, TypeOrmModuleOptions } from "@nestjs/typeorm";
import { EnvironmentsModule } from "../core/environment/environment.module";
import { EnvironmentsService } from "../core/environment/environment.service";

export const typeormModule = () =>
	TypeOrmModule.forRootAsync({
		inject: [EnvironmentsService],
		useFactory: async (
			env: EnvironmentsService,
		): Promise<TypeOrmModuleOptions> => {
			return <TypeOrmModuleOptions>{
				name: "default",
				logging: true,
				logger: "advanced-console",
				type: "postgres",
				host: env.ENVIRONMENTS.DB_HOST,
				port: env.ENVIRONMENTS.DB_PORT,
				username: env.ENVIRONMENTS.DB_USER,
				database: env.ENVIRONMENTS.DB_NAME,
				password: env.ENVIRONMENTS.DB_PASSWORD,
				entities: [__dirname + "/entities/**/*.entity{.ts,.js}"],
				keepConnectionAlive: true,
				extra: {
					connectionLimit: env.ENVIRONMENTS.DB_CONNECTION_LIMIT,
				},
			};
		},
		imports: [EnvironmentsModule],
	});
