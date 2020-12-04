import { Module } from "@nestjs/common";
import { AuthModule } from "@internal/core/auth/auth.module";
import { PostModule } from "./module/post/post.module";
import { UserAuthModule } from "./module/user-auth/user-auth.module";
import { UserModule } from "./module/user/user.module";
import { EnvironmentsModule } from "@internal/core/environment/environment.module";
import { typeormModule } from "@internal/database/typeorm.module";

@Module({
	imports: [
		PostModule,
		UserModule,
		AuthModule,
		EnvironmentsModule,
		UserAuthModule,
		typeormModule(),
	],
})
export class AppModule {}
