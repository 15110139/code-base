import { Module } from "@nestjs/common";
import { I18NextService } from "./i18next.service";

@Module({
	providers: [I18NextService],
	exports: [I18NextService],
})
export class I18NextModule {}
