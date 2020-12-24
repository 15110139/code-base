import { Module } from "@nestjs/common";
import { MqService } from "./mq.service";
import { EnvironmentsModule } from "@internal/core/environment/environment.module";

@Module({ imports: [EnvironmentsModule], providers: [MqService] })
export class MqModule {}
