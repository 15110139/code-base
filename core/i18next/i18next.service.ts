/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import {
	Injectable,
	Logger,
	OnApplicationBootstrap,
	ValueProvider,
} from "@nestjs/common";
import * as langEN from "../lang/en_US/translate.json";
import * as langVI from "../lang/vi_VN/translate.json";
import * as i from "i18next";
import { ResponseApiInterface } from "@internal/shared/api-interface/base-api-interface";
import { SYSTEM_CODE } from "@internal/shared/business/system-code";
import { EnvironmentsProvider } from "../environment/environment.service";
const i18next: i.i18n = require("i18next");

export enum LANGUE {
	EN_US = "en_US",
	VI_VN = "vi_VN",
}

@Injectable()
export class I18NextService implements OnApplicationBootstrap {
	private logger = new Logger(this.constructor.name);
	public i18next: i.i18n;
	constructor() {
		this.i18next = i18next;
	}
	async onApplicationBootstrap(): Promise<void> {
		try {
			await i18next.init({
				lng: LANGUE.EN_US,
				resources: {
					[LANGUE.EN_US]: {
						translation: langEN,
					},
					[LANGUE.VI_VN]: {
						translation: langVI,
					},
				},
			});
		} catch (error) {
			this.logger.error(
				`Error when init i18next module : ${error.message}`,
			);
		}
	}
	async translation(
		lang: LANGUE,
		systemCode: string,
		data?: unknown,
		debugError?: any,
	): Promise<ResponseApiInterface<any>> {
		if (!Object.keys(langEN).includes(systemCode)) {
			this.logger.error(`Please add system code for: `);
			this.logger.error(data);
		}
		const response: ResponseApiInterface<any> = {
			systemCode,
			data,
			message: this.i18next.t(systemCode, {
				lng:lang,
			}),
		};
		if (
			systemCode !== SYSTEM_CODE.SUCCESS &&
			EnvironmentsProvider.useValue.ENVIRONMENTS.DISPLAY_ERROR_DETAIL
		) {
			response.debugError = debugError;
		}
		return response;
	}
}

export const I18NextProvider: ValueProvider<I18NextService> = {
	provide: I18NextService,
	useValue: new I18NextService(),
};
