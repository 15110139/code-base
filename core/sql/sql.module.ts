import {
	Logger,
	Module,
	OnApplicationShutdown,
	OnModuleInit,
} from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { getConnection } from "typeorm";
import { SqlService } from "./sql.service";

@Module({
	imports: [TypeOrmModule.forFeature([])],
	providers: [SqlService],
})
export class SqlModule implements OnApplicationShutdown, OnModuleInit {
	private logger = new Logger(SqlModule.name);
	async onModuleInit() {
		setInterval(() => {
			keepAlive(this.logger);
		}, 1000 * 60);
	}
	async onApplicationShutdown() {
		if (getConnection().isConnected) {
			await getConnection().close();
			this.logger.log("Close DB connection.");
		}
	}
}

async function keepAlive(logger: Logger) {
	const connection = getConnection();
	try {
		await connection.query("SELECT 'KEEP_ALIVE';");
	} catch (e) {
		logger.error(e);
		logger.error(
			"Failed to send keep alive query - closing dead connection",
		);
		if (connection.isConnected) {
			await connection.close();
		}
		logger.error("Closed dead connection");
		logger.log("Reconnection...");
		await connection.connect();
	}
}
