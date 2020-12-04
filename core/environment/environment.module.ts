import { Module } from "@nestjs/common";
import { EnvironmentsService } from "./environment.service";

@Module({
	providers: [EnvironmentsService],
	exports: [EnvironmentsService],
})
export class EnvironmentsModule {}
