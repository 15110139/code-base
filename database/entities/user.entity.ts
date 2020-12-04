import { TOKEN_TYPE } from "@internal/shared/business/jwt.model";
import { Column, Entity } from "typeorm";
import { BaseEntity } from "./base.entity";
@Entity("users")
export class UserEntity extends BaseEntity {
	@Column("varchar")
	public email!: string;

	@Column("varchar")
	public password!: string;

	@Column("varchar")
	public user_type!: TOKEN_TYPE;
}
