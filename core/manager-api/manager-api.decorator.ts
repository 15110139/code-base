import { SetMetadata } from "@nestjs/common";
import {
	ENVIRONMENTS,
	EnvironmentsService,
} from "@internal/core/environment/environment.service";
export const PUBLIC_API_ENVIRONMENT = Symbol("env");

export type PublicApiEnvironment = {
	[key in ENVIRONMENTS]?: {
		ipPublish: keyof EnvironmentsService["ENVIRONMENTS"] | "*";
	};
};

export const PublicApi = (config: PublicApiEnvironment) =>
	SetMetadata(PUBLIC_API_ENVIRONMENT, config);
