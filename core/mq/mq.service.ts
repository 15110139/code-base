import {
	Injectable,
	OnModuleDestroy,
	OnModuleInit,
	InternalServerErrorException,
} from "@nestjs/common";

import { connect, Connection, Options } from "amqplib";
import { EnvironmentsService } from "@internal/core/environment/environment.service";
import { LoggerService } from "../base-service/logger.service";

@Injectable()
export class MqService implements OnModuleInit, OnModuleDestroy {
	private client!: Connection;
	public logger = new LoggerService().setContext(this.constructor.name);

	constructor(private envService: EnvironmentsService) {}
	public getConnection(): Connection {
		return this.client;
	}

	private connectionSetting(): Options.Connect {
		return {
			hostname: this.envService.ENVIRONMENTS.MQ_HOST,
			port: this.envService.ENVIRONMENTS.MQ_PORT,
			password: this.envService.ENVIRONMENTS.MQ_PASSWORD,
			username: this.envService.ENVIRONMENTS.MQ_USER,
		};
	}

	private handleConnect(): void {
		this.client.on("connect", () => {
			this.logger.log("CONNECTED TO MQ");
			this.handleConnect();
		});
	}

	private handleReconnect(): void {
		this.client.on("reconnect", () => {
			this.logger.warn("TRY TO RECONNECT MQ");
		});
		// Service offline
		this.client.on("offline", () => {
			this.logger.error("MQ OFFLINE");
			// Disconnect and then connect
			this.client.once("connect", async () => {
				this.logger.warn("MQ ONLINE");
				try {
					await this.client.close();
				} catch (e) {
					this.logger.error("ERROR ! DISCONNECT MQ");
					process.exit();
				}
				this.client = await connect(this.connectionSetting());
				this.client.once("connect", () => {
					this.logger.log("CONNECTED TO MQ");
					// Resubscribe

					// Handling reconnect again
					this.handleReconnect();
				});
			});
		});
	}

	public async subscribeChannel(queue: string, handler: Function) {
		const channel = await this.client.createChannel();
		channel.consume(
			queue,
			msg => {
				if (!msg) {
					console.log(msg);
				} else {
					this.logger.log(`Data receive : ${msg.content.toString()}`);
					handler(msg);
				}
			},
			{},
		);
	}

	public async publishToChanel(
		queue: string,
		data: Object,
		config: Options.Publish,
	) {
		try {
			const channel = await this.client.createChannel();
			this.logger.log(
				`Publish message to channel ${queue} with data ${JSON.stringify(
					data,
				)}`,
			);
			channel.prefetch(1);
			channel.sendToQueue(queue, Buffer.from(data), config);
		} catch (error) {
			throw new InternalServerErrorException("PUBLISH_FAILURE");
		}
	}

	onModuleDestroy(): any {}

	async onModuleInit(): Promise<void> {
		this.logger.log("Connecting to MQ ====> ");
		this.logger.log("Connection settings : ");
		this.logger.log(JSON.stringify(this.connectionSetting()));
		this.client = await connect(this.connectionSetting());
		this.logger.log("START CONNECTION MQ");
		this.client.once("connect", () => {
			this.logger.log("CONNECTED TO MQ");
			this.handleReconnect();
		});
		this.handleConnect();
	}
}
