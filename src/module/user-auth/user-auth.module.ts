import { Module } from "@nestjs/common";
import { AuthModule } from "@internal/core/auth/auth.module";
import { UserModule } from "../user/user.module";
import { UserAuthController } from "./user-auth.controller";

@Module({
	imports: [AuthModule, UserModule],
	controllers: [UserAuthController],
})
export class UserAuthModule {}
