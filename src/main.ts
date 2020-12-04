import { BadRequestException, Logger, ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { NestExpressApplication } from "@nestjs/platform-express";
import { EnvironmentsProvider } from "@internal/core/environment/environment.service";
import { AppModule } from "./app.module";
import * as path from "path";
import moduleAlias = require("module-alias");

moduleAlias.addAlias("@internal/shared",path.resolve(__dirname + "../../shared"));
moduleAlias.addAlias("@internal/core", path.resolve(__dirname + "../../core"));
moduleAlias.addAlias("@internal/database",path.resolve(__dirname + "../../database"));

async function bootstrap() {
	const app = await NestFactory.create<NestExpressApplication>(AppModule, {
		bodyParser: true,
		logger: new Logger(),
	});
	app.setGlobalPrefix(EnvironmentsProvider.useValue.ENVIRONMENTS.API_PREFIX);
	app.useGlobalPipes(
		new ValidationPipe({
			transform: true,
			whitelist: true,
			forbidUnknownValues: true,
			forbidNonWhitelisted: true,
			exceptionFactory: error => {
				Logger.error("Validate error");
				Logger.error(error);
				return new BadRequestException(error);
			},
		}),
	);
	await app.listen(EnvironmentsProvider.useValue.ENVIRONMENTS.API_PORT);
	await app.init();
	Logger.log(
		`App start port ${EnvironmentsProvider.useValue.ENVIRONMENTS.API_PORT}`,
	);
	return app;
}

(async () => {
	await bootstrap();
})();
