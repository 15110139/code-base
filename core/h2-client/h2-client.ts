import { DTO } from "@internal/shared/api-interface/base-api-interface";
import { plainToClass } from "class-transformer";
import { ClassType } from "class-transformer/ClassTransformer";
import { context, Response } from "fetch-h2";
import { FetchInit } from "fetch-h2/dist/lib/core";
import { LoggerService } from "../base-service/logger.service";

export class H2Client {
	private logger = new LoggerService().setContext(this.constructor.name);
	private client!: ReturnType<typeof context>;

	public async fetchDTO<T extends DTO>(
		dto: T,
	): Promise<DTO["responseDTOClass"]["prototype"]> {
		const res = await this.fetchRaw(dto.interpolatedUrl, {
			timeout: 60 * 1000,
			headers: {
				...dto.headerDTO,
				"Content-Type": "application/json",
			},
			body: dto.bodyDTO,
			method: dto.method,
		});
		if (!res.ok) {
			this.logger.error(await res.text());
			throw new Error(`H2 Request failed - code: ${res.status}`);
		}
		return plainToClass(
			dto.responseDTOClass as ClassType<T["responseDTOClass"]>,
			await res.json(),
		);
	}
	public async fetchRaw(
		inputURL: string,
		init?: Partial<FetchInit> | undefined,
		retry = true,
	): Promise<Response | never> {
		try {
			this.logger.log(`Requesting ==>> ${inputURL}`);
			return await this.client.fetch(inputURL, {
				...init,
				timeout: 60 * 1000,
			});
		} catch (e) {
			if (e.code === "ERR_HTTP2_INVALID_SESSION" && retry) {
				await this.client.disconnectAll();
				this.client = context({
					httpsProtocols: ["http2"],
					httpProtocol: "http2",
				});
				return this.fetchRaw(inputURL, init, false);
			} else {
				this.logger.error("H2 REQUEST ERROR: ");
				this.logger.error(e);
				this.logger.error(e.code);
				this.logger.error(e.message);
				this.logger.error(e.stack);
			}

			throw e;
		}
	}
}
