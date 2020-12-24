import { Module } from "@nestjs/common";
import { JwtModule, JwtModuleOptions } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { EnvironmentsModule } from "../environment/environment.module";
import { EnvironmentsService } from "../environment/environment.service";
import { AuthService } from "./auth.service";
import { JwtStrategy } from "./jwt.strategy";

@Module({
	imports: [
		PassportModule.register({ defaultStrategy: "jwt" }),
		EnvironmentsModule,
		JwtModule.registerAsync({
			imports: [EnvironmentsModule],
			useFactory: async (
				env: EnvironmentsService,
			): Promise<JwtModuleOptions> => {
				return {
					secret: env.ENVIRONMENTS.JWT_SECRET,
				};
			},
			inject: [EnvironmentsService],
		}),
	],
	providers: [AuthService, JwtStrategy],
	exports: [AuthService, PassportModule],
})
export class AuthModule {}
